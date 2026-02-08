# Backend API - Task1 Web Application

RESTful API built with Node.js, Express, TypeScript, Prisma ORM, and MySQL.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL 8.0
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Security:** Helmet, CORS, bcrypt, rate limiting

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Prisma client initialization
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   └── postController.ts    # Posts CRUD logic
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   └── errorHandler.ts     # Global error handler
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   └── posts.ts             # Posts routes
│   └── server.ts                # Express app entry point
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
└── .env                         # Environment variables
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2026-02-08T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2026-02-08T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "posts": [
      {
        "id": 1,
        "title": "My First Post",
        "status": "published",
        "createdAt": "2026-02-08T10:30:00.000Z"
      }
    ]
  }
}
```

#### 4. Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

### Posts Endpoints

#### 1. Get All Posts
```http
GET /api/posts?page=1&limit=10&search=blog&status=published
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title, content, excerpt
- `status` (optional): Filter by status (draft/published)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "My Blog Post",
        "content": "Full content...",
        "excerpt": "Brief summary",
        "status": "published",
        "authorId": 1,
        "author": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2026-02-08T10:30:00.000Z",
        "updatedAt": "2026-02-08T11:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

#### 2. Get Single Post
```http
GET /api/posts/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Blog Post",
    "content": "Full content...",
    "excerpt": "Brief summary",
    "status": "published",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-08T10:30:00.000Z",
    "updatedAt": "2026-02-08T11:00:00.000Z"
  }
}
```

#### 3. Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My New Post",
  "content": "This is the full content of my post...",
  "excerpt": "Brief summary",
  "status": "published"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 2,
    "title": "My New Post",
    "content": "This is the full content of my post...",
    "excerpt": "Brief summary",
    "status": "published",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-08T12:00:00.000Z",
    "updatedAt": "2026-02-08T12:00:00.000Z"
  }
}
```

#### 4. Update Post (Protected)
```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "draft"
}
```

**Note:** Only the post author can update their own posts.

#### 5. Delete Post (Protected)
```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Note:** Only the post author can delete their own posts.

### Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-08T12:00:00.000Z"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Codes

- **400 Bad Request:** Invalid input or validation error
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource already exists (e.g., email in use)
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email"
    },
    {
      "msg": "Password must be at least 8 characters long",
      "param": "password"
    }
  ]
}
```

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  posts     Post[]
}
```

### Post Model
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  excerpt   String?  @db.VarChar(500)
  status    String   @default("draft")
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([authorId])
  @@index([status])
}
```

## Authentication Flow

1. User registers or logs in
2. Server validates credentials
3. Server generates JWT token with 1-hour expiration
4. Client stores token (localStorage or cookies)
5. Client includes token in Authorization header for protected routes
6. Server validates token on each request
7. Token expires after 1 hour, user must login again

## Security Features

✅ **Password Hashing:** bcrypt with 10 salt rounds  
✅ **JWT Authentication:** 1-hour token expiration  
✅ **Input Validation:** Express Validator on all endpoints  
✅ **SQL Injection Prevention:** Prisma ORM with parameterized queries  
✅ **Rate Limiting:** 100 requests per 15 minutes per IP  
✅ **CORS Protection:** Restricted to frontend origin  
✅ **Security Headers:** Helmet middleware  
✅ **Authorization Checks:** Users can only modify their own content

## Running the Backend

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Environment Variables

Create `.env` file in backend root:

```env
DATABASE_URL="mysql://task1_user:task1_password@localhost:3306/task1_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

## Testing with Postman

1. Import `postman_collection.json` from project root
2. Register or login to get JWT token
3. Token is automatically saved to environment variable
4. Use token for protected endpoints

## Common Issues

### Connection Refused
- Ensure MySQL container is running: `docker ps`
- Check DATABASE_URL in `.env`

### Token Expired
- JWT tokens expire after 1 hour
- Login again to get a new token

### Port Already in Use
- Change PORT in `.env`
- Or stop the process using port 5000

## API Rate Limits

- **Global:** 100 requests per 15 minutes per IP
- **Production:** Implement per-user rate limiting with Redis

## Future Enhancements

- [ ] Refresh token implementation
- [ ] Email verification
- [ ] Password reset flow
- [ ] File upload for post images
- [ ] Comments system
- [ ] Role-based access control (admin/user)
- [ ] API versioning
- [ ] GraphQL endpoint
- [ ] WebSocket support for real-time features

## License

MIT
