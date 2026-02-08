# Deployment Guide

Complete guide for deploying the Task1 web application to production.

## Overview

This guide covers deploying:
- **Frontend:** Next.js application to Vercel
- **Backend:** Express API to Railway
- **Database:** MySQL on Railway or AWS RDS

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available) OR AWS account
- Domain name (optional)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create Git Repository

```powershell
# Initialize git repository
cd d:\task1
git init

# Create .gitignore (already exists)
# Add and commit files
git add .
git commit -m "Initial commit: Full-stack web app with authentication"

# Push to GitHub
git remote add origin https://github.com/yourusername/task1-webapp.git
git branch -M main
git push -u origin main
```

### 1.2 Update Environment Variables

Create production environment variable templates:

**Backend (.env.production.example):**
```env
DATABASE_URL="mysql://user:password@production-host:3306/prod_db"
JWT_SECRET="generate-secure-random-string-here"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.vercel.app"
```

**Frontend (.env.production.local.example):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app/api
```

---

## Step 2: Deploy Database

### Option A: Railway (Recommended for Quick Setup)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create MySQL Database**
   - Click "New Project"
   - Select "Provision MySQL"
   - Railway automatically creates a MySQL instance

3. **Get Database Credentials**
   - Click on MySQL service
   - Go to "Variables" tab
   - Copy `DATABASE_URL` connection string
   - Format: `mysql://user:password@host:port/database`

4. **Create Tables**
   ```powershell
   # Update backend/.env with Railway DATABASE_URL
   cd backend
   npx prisma migrate deploy
   ```

### Option B: AWS RDS

1. **Create RDS Instance**
   - Go to AWS RDS Console
   - Click "Create database"
   - Choose MySQL 8.0
   - Instance size: db.t3.micro (free tier)
   - Storage: 20 GB SSD
   - Set master username/password
   - Make publicly accessible (for development)

2. **Configure Security Group**
   - Allow inbound traffic on port 3306
   - Add your IP and backend server IP

3. **Get Connection Details**
   - Endpoint: `your-db.xxxxxx.us-east-1.rds.amazonaws.com`
   - Port: 3306
   - Database: `task1_db`
   - Format URL: `mysql://user:password@endpoint:3306/task1_db`

4. **Create Tables**
   ```powershell
   # Update backend/.env with RDS connection URL
   cd backend
   npx prisma migrate deploy
   ```

---

## Step 3: Deploy Backend

### Railway Deployment

1. **Create New Project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select `task1-webapp` repository

2. **Configure Service**
   - Railway will detect the monorepo
   - Click "Add a Service"
   - Select "Backend"
   - Set root directory: `backend`

3. **Set Environment Variables**
   - Click on backend service
   - Go to "Variables" tab
   - Add variables:
     ```
     DATABASE_URL=<your-database-url>
     JWT_SECRET=<generate-secure-random-string>
     JWT_EXPIRES_IN=1h
     NODE_ENV=production
     CORS_ORIGIN=<your-frontend-url>
     PORT=5000
     ```

4. **Configure Build Settings**
   - Build command: `npm install && npx prisma generate && npm run build`
   - Start command: `npm start`

5. **Deploy**
   - Railway automatically deploys on push to main
   - Get your backend URL: `https://your-service.up.railway.app`

6. **Run Migrations**
   ```powershell
   # In Railway dashboard, open service shell
   npx prisma migrate deploy
   ```

### Alternative: Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository
   - Select "task1-webapp"

2. **Configure Service**
   - Name: task1-backend
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables**
   - Add same variables as Railway

4. **Deploy**
   - Render auto-deploys on push

---

## Step 4: Deploy Frontend

### Vercel Deployment (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import `task1-webapp` repository
   - Vercel detects Next.js automatically

3. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your URL: `https://your-project.vercel.app`

6. **Update Backend CORS**
   - Go back to Railway backend variables
   - Update `CORS_ORIGIN` to your Vercel URL

### Alternative: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from GitHub

2. **Configure Build**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`

3. **Set Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy**
   - Netlify auto-deploys on push

---

## Step 5: Verify Deployment

### Backend Health Check

```bash
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-08T..."
}
```

### Test Authentication

```bash
# Register
curl -X POST https://your-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Frontend

1. Visit `https://your-project.vercel.app`
2. Try registering a new user
3. Login and create a post
4. Verify all CRUD operations work

---

## Step 6: Configure Custom Domain (Optional)

### Frontend Domain (Vercel)

1. **Add Domain**
   - Go to Vercel project settings
   - Click "Domains"
   - Add your domain (e.g., `myapp.com`)

2. **Update DNS**
   - Add CNAME record in your DNS provider:
     ```
     Type: CNAME
     Name: @
     Value: cname.vercel-dns.com
     ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL

### Backend Domain (Railway)

1. **Add Custom Domain**
   - Go to Railway service settings
   - Click "Networking"
   - Add custom domain (e.g., `api.myapp.com`)

2. **Update DNS**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: api
     Value: your-service.up.railway.app
     ```

3. **Update Frontend Environment**
   - Update `NEXT_PUBLIC_API_URL` in Vercel to use new domain
   - Update `CORS_ORIGIN` in Railway backend

---

## Step 7: Setup CI/CD

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Step 8: Monitoring & Logging

### Frontend Monitoring (Vercel Analytics)

1. Enable Vercel Analytics in project settings
2. View real-time metrics and Web Vitals

### Backend Monitoring

#### Option 1: Railway Logs
- View logs in Railway dashboard
- Real-time log streaming

#### Option 2: External Monitoring (Sentry)

```typescript
// backend/src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

---

## Step 9: Database Backups

### Railway Backups

- Railway automatically backs up databases
- Restore from dashboard if needed

### AWS RDS Backups

1. **Enable Automated Backups**
   - Retention period: 7 days
   - Backup window: 03:00-04:00 UTC

2. **Manual Snapshots**
   - Create snapshot before major changes
   - Restore from snapshot if needed

---

## Step 10: Security Checklist

### Before Going Live

✅ Change JWT_SECRET to strong random string  
✅ Update CORS_ORIGIN to production URL only  
✅ Enable HTTPS (handled by Vercel/Railway)  
✅ Set secure database password  
✅ Enable database SSL connection  
✅ Review API rate limits  
✅ Setup error monitoring (Sentry)  
✅ Enable database backups  
✅ Test all authentication flows  
✅ Verify password reset (if implemented)  
✅ Check for exposed secrets in code  
✅ Enable firewall rules on database  
✅ Setup uptime monitoring  

---

## Troubleshooting

### Backend Issues

**Problem:** Database connection failed

**Solution:**
- Verify DATABASE_URL is correct
- Check database firewall rules
- Ensure IP whitelist includes backend server

**Problem:** CORS errors from frontend

**Solution:**
- Update CORS_ORIGIN in backend environment variables
- Restart backend service

**Problem:** 502 Bad Gateway

**Solution:**
- Check backend logs for errors
- Verify PORT environment variable
- Ensure build completed successfully

### Frontend Issues

**Problem:** "Cannot connect to backend"

**Solution:**
- Verify NEXT_PUBLIC_API_URL is correct
- Test backend health endpoint
- Check browser console for CORS errors

**Problem:** Environment variables not updating

**Solution:**
- Re-deploy after changing env variables
- Clear Vercel cache and rebuild

---

## Performance Optimization

### Enable Caching

1. **Frontend:** Vercel Edge Network (automatic)
2. **Backend:** Add Redis for API response caching
3. **Database:** Enable query cache in MySQL

### CDN for Static Assets

- Vercel automatically uses CDN for static files
- For backend: Use AWS CloudFront or Cloudflare

### Database Optimization

- Add indexes (already implemented)
- Enable connection pooling
- Use read replicas for high traffic

---

## Cost Estimates

### Free Tier (Development/Low Traffic)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | Yes | 100GB bandwidth/month |
| Railway | $5 credit/month | ~500 hours runtime |
| AWS RDS | 12 months free | 750 hours/month |

### Production (Moderate Traffic)

| Service | Estimated Cost | Notes |
|---------|----------------|-------|
| Vercel Pro | $20/month | More bandwidth, team features |
| Railway | $10-30/month | Based on usage |
| AWS RDS | $15-50/month | t3.micro instance |

**Total:** ~$45-100/month for moderate production use

---

## Scaling for Growth

When you need to scale:

1. **Horizontal Scaling:**
   - Deploy multiple backend instances (Railway auto-scaling)
   - Add load balancer

2. **Database Scaling:**
   - Upgrade instance size
   - Add read replicas
   - Use database connection pooling

3. **Caching:**
   - Add Redis for session/API caching
   - Enable CDN caching

4. **Monitoring:**
   - Set up alerts for downtime
   - Monitor response times
   - Track error rates

Refer to `SCALING.md` for detailed strategies.

---

## Rollback Strategy

If deployment has issues:

1. **Frontend (Vercel):**
   - Go to Deployments tab
   - Click "..." on previous deployment
   - Select "Promote to Production"

2. **Backend (Railway):**
   - Railway keeps previous deployments
   - Rollback from dashboard

3. **Database:**
   - Restore from automated backup
   - Or manually restore snapshot

---

## Post-Deployment

### Update Documentation

- Update README with production URLs
- Document any environment-specific configuration
- Add deployment badge to README

### Monitor First Week

- Check error rates daily
- Monitor response times
- Review user feedback
- Fix critical issues immediately

### Regular Maintenance

- Update dependencies monthly
- Review and rotate JWT secrets quarterly
- Backup database weekly
- Monitor costs and optimize

---

## Support & Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **AWS RDS Docs:** [aws.amazon.com/rds](https://aws.amazon.com/rds)
- **Project Docs:** See `SCALING.md`, `README.md`, `SETUP.md`

---

## Deployment Checklist

Before deploying to production:

- [ ] Code pushed to GitHub
- [ ] Database deployed and accessible
- [ ] Database migrations run successfully
- [ ] Backend deployed with all env variables
- [ ] Frontend deployed with correct API URL
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and secure
- [ ] Health check endpoint working
- [ ] Test user registration
- [ ] Test user login
- [ ] Test post creation
- [ ] Test post editing/deletion
- [ ] Test search and filter
- [ ] Verify error handling
- [ ] Setup monitoring
- [ ] Enable database backups
- [ ] Document deployment process
- [ ] Inform team of URLs

---

**Congratulations! Your application is now live! 🎉**
