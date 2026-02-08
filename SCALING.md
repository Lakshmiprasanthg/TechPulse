# Production Scaling Guide

This document outlines comprehensive strategies for scaling the Task1 web application for production deployment, covering infrastructure, database optimization, caching, monitoring, and security hardening.

## Table of Contents

1. [Horizontal Scaling & Load Balancing](#horizontal-scaling--load-balancing)
2. [Database Optimization](#database-optimization)
3. [Caching Strategies](#caching-strategies)
4. [Frontend Optimization](#frontend-optimization)
5. [API & Backend Optimization](#api--backend-optimization)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Hardening](#security-hardening)
8. [Infrastructure as Code](#infrastructure-as-code)
9. [Deployment Strategy](#deployment-strategy)

---

## Horizontal Scaling & Load Balancing

### Backend API Scaling

**Current State:** Single Node.js server instance  
**Production Goal:** Multiple stateless API server instances

#### Implementation Steps:

1. **Containerization**
   ```bash
   # Dockerfile for backend
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npx prisma generate
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Kubernetes Deployment**
   ```yaml
   # backend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: backend-api
   spec:
     replicas: 3  # Start with 3 instances
     selector:
       matchLabels:
         app: backend-api
     template:
       metadata:
         labels:
           app: backend-api
       spec:
         containers:
         - name: backend
           image: task1/backend:latest
           ports:
           - containerPort: 5000
           env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: url
           resources:
             requests:
               memory: "256Mi"
               cpu: "250m"
             limits:
               memory: "512Mi"
               cpu: "500m"
   ```

3. **Load Balancer Configuration**
   - Use NGINX or AWS Application Load Balancer (ALB)
   - Implement health checks on `/health` endpoint
   - Session affinity: Not required (stateless JWT auth)
   - Sticky sessions: Disabled (stateless architecture)

4. **Auto-scaling Rules**
   ```yaml
   # HorizontalPodAutoscaler
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: backend-api-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: backend-api
     minReplicas: 2
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   ```

### Frontend Scaling

**Current State:** Next.js application  
**Production Goal:** Edge-deployed static assets with dynamic API routes

1. **Deploy to Vercel/AWS**
   - Vercel: Automatic edge deployment, global CDN
   - AWS: CloudFront + S3 for static assets, Lambda@Edge for SSR

2. **Static Generation**
   - Use Static Site Generation (SSG) for marketing pages
   - Implement Incremental Static Regeneration (ISR) for frequently accessed content

---

## Database Optimization

### Connection Pooling

**Problem:** Each API instance creates database connections  
**Solution:** Implement connection pooling

```typescript
// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});

// Connection pool settings in DATABASE_URL
// mysql://user:pass@host:3306/db?connection_limit=20&pool_timeout=60
```

### Database Indexing

```sql
-- Essential indexes for performance
CREATE INDEX idx_posts_author ON posts(authorId);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created ON posts(createdAt DESC);
CREATE INDEX idx_posts_search ON posts(title, content(100));
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for common queries
CREATE INDEX idx_posts_author_status ON posts(authorId, status);
CREATE INDEX idx_posts_status_created ON posts(status, createdAt DESC);
```

### Read Replicas

**Implementation:**

1. **MySQL Read Replicas** (AWS RDS Multi-AZ)
   ```typescript
   // Separate read and write connections
   const writeDb = new PrismaClient({
     datasources: { db: { url: process.env.DATABASE_WRITE_URL } },
   });
   
   const readDb = new PrismaClient({
     datasources: { db: { url: process.env.DATABASE_READ_REPLICA_URL } },
   });
   
   // Use read replica for GET requests
   export const getPostsFromReplica = () => readDb.post.findMany();
   
   // Use primary for writes
   export const createPost = (data) => writeDb.post.create({ data });
   ```

2. **Replication Lag Handling**
   - Redirect writes to primary database
   - Use read replicas only for read-heavy operations
   - Implement retry logic for critical reads after writes

### Query Optimization

```typescript
// BAD: N+1 query problem
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// GOOD: Use includes/select
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { id: true, name: true, email: true },
    },
  },
});
```

### Database Partitioning

For large datasets (millions of posts):

```sql
-- Partition by date range
CREATE TABLE posts_2026_q1 PARTITION OF posts
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
  
CREATE TABLE posts_2026_q2 PARTITION OF posts
  FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
```

---

## Caching Strategies

### Redis Integration

**Use Cases:**
1. Session management (if needed)
2. API response caching
3. Rate limiting
4. Real-time features

```typescript
// backend/src/config/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
});

export default redis;
```

```typescript
// Cache middleware for posts
import redis from './config/redis';

export const cacheMiddleware = (duration: number) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
};

// Usage
router.get('/posts', cacheMiddleware(300), getPosts); // Cache for 5 minutes
```

### CDN for Static Assets

1. **CloudFront Configuration**
   - Origin: S3 bucket or Next.js server
   - Cache behaviors: Cache images, CSS, JS for 1 year
   - Invalidation: Trigger on deployment

2. **Next.js Image Optimization**
   ```tsx
   import Image from 'next/image';
   
   // Automatic optimization, lazy loading, WebP conversion
   <Image 
     src="/profile.jpg" 
     alt="Profile" 
     width={500} 
     height={500}
     priority={false}
   />
   ```

### Cache Invalidation Strategy

```typescript
// Invalidate cache on post creation/update
export const createPost = async (data) => {
  const post = await prisma.post.create({ data });
  
  // Invalidate relevant caches
  await redis.del('cache:/api/posts*');
  await redis.del(`cache:/api/posts/${post.id}`);
  
  return post;
};
```

---

## Frontend Optimization

### Code Splitting

```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const PostEditor = dynamic(() => import('@/components/PostEditor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false, // Disable SSR for client-only components
});
```

### Bundle Size Optimization

```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};
```

### Service Worker for Offline Support

```typescript
// public/sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## API & Backend Optimization

### API Gateway

**AWS API Gateway Benefits:**
- Rate limiting per API key
- Request/response transformation
- Caching at gateway level
- Lambda integration for serverless

### Response Compression

```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9)
}));
```

### Database Query Batching

```typescript
// Use DataLoader for batching
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds) => {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  });
  return userIds.map(id => users.find(u => u.id === id));
});

// Usage in resolvers
const user = await userLoader.load(post.authorId);
```

---

## Monitoring & Logging

### Application Monitoring

1. **Sentry for Error Tracking**
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 0.1, // 10% of transactions
   });
   
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.errorHandler());
   ```

2. **Prometheus Metrics**
   ```typescript
   import promClient from 'prom-client';
   
   const register = new promClient.Registry();
   promClient.collectDefaultMetrics({ register });
   
   const httpRequestDuration = new promClient.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status_code'],
   });
   
   register.registerMetric(httpRequestDuration);
   ```

### Structured Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'backend-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log with context
logger.info('Post created', {
  userId: user.id,
  postId: post.id,
  timestamp: new Date().toISOString(),
});
```

### Performance Monitoring

- **Frontend:** Web Vitals tracking with Vercel Analytics
- **Backend:** New Relic or Datadog APM
- **Database:** AWS RDS Performance Insights

---

## Security Hardening

### Rate Limiting (Production-Grade)

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from './config/redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
    });
  },
});
```

### JWT Token Refresh Strategy

```typescript
// Generate refresh token (longer expiry)
const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });

// Store refresh token in database
await prisma.refreshToken.create({
  data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
});

// Refresh endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  
  // Verify token exists in database
  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken: newAccessToken });
});
```

### HTTPS & SSL/TLS

- Use Let's Encrypt for free SSL certificates
- Enforce HTTPS in production
- Set secure cookie flags: `httpOnly`, `secure`, `sameSite`

### SQL Injection Prevention

✅ **Already Protected:** Prisma ORM uses parameterized queries

### XSS Protection

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
```

---

## Infrastructure as Code

### Terraform Example (AWS)

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_rds_cluster" "mysql" {
  cluster_identifier      = "task1-db-cluster"
  engine                  = "aurora-mysql"
  master_username         = var.db_username
  master_password         = var.db_password
  database_name           = "task1_db"
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "task1-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

resource "aws_ecs_cluster" "backend" {
  name = "task1-backend-cluster"
}
```

---

## Deployment Strategy

### Blue-Green Deployment

1. Deploy new version (Green)
2. Run health checks
3. Switch traffic from Blue to Green
4. Monitor for errors
5. Rollback to Blue if issues detected

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        run: |
          docker build -t task1-backend:${{ github.sha }} ./backend
          docker push task1-backend:${{ github.sha }}
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend-api backend=task1-backend:${{ github.sha }}
          kubectl rollout status deployment/backend-api

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Cost Optimization

1. **Auto-scaling:** Scale down during low traffic
2. **Reserved Instances:** AWS RDS Reserved Instances for 30-50% savings
3. **Spot Instances:** Use for non-critical workloads
4. **CloudFront:** Reduce origin server costs
5. **Database Connection Pooling:** Reduce RDS costs

---

## Performance Benchmarks

### Target Metrics (Production)

- **API Response Time:** < 200ms (p95)
- **Database Query Time:** < 50ms (p95)
- **Frontend Load Time:** < 2s (FCP)
- **Uptime:** 99.9% (43 minutes downtime/month)
- **Throughput:** 1000 requests/second per instance

---

## Conclusion

This scaling guide provides a comprehensive roadmap for taking the Task1 application from development to production-grade infrastructure. Implement these strategies incrementally based on actual traffic patterns and performance bottlenecks.

**Priority Order:**
1. Database indexing and connection pooling
2. Redis caching for frequently accessed data
3. Horizontal scaling with load balancing
4. CDN for static assets
5. Monitoring and logging
6. Advanced optimizations (read replicas, partitioning)
