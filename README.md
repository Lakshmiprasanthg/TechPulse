# Scalable Web App with Authentication & Dashboard

A full-stack web application featuring JWT-based authentication, user management, and a blog-style posts management dashboard.

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** (App Router) - React framework with SSR capabilities
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe development
- **Prisma ORM** - Type-safe database client
- **MySQL 8.0** - Relational database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## ✨ Features

### Authentication System
- ✅ User registration with email/password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes (frontend & backend)
- ✅ User profile management

### Dashboard
- ✅ User profile display
- ✅ Blog posts CRUD operations
- ✅ Search and filter functionality
- ✅ Pagination support
- ✅ Responsive design

### Security
- ✅ JWT authentication with 1-hour expiry
- ✅ Password hashing (bcrypt, 10 salt rounds)
- ✅ Input validation (client & server)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention (Prisma)
- ✅ Security headers (helmet)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose (for MySQL)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task1
```

### 2. Start MySQL Database
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🗄️ Database Schema

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
  excerpt   String?
  status    String   @default("draft")
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

See `postman_collection.json` for detailed API documentation.

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json`
2. Register a new user via `/api/auth/register`
3. Login via `/api/auth/login` to get JWT token
4. Use the token in Authorization header for protected routes

### Manual Testing
1. Navigate to `http://localhost:3000/register`
2. Create an account
3. Login with your credentials
4. Explore the dashboard and create posts

## 📁 Project Structure

```
task1/
├── backend/
│   ├── src/
│   │   ├── config/       # Database and app configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, error handling, validation
│   │   ├── routes/       # API route definitions
│   │   └── server.ts     # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/      # Auth pages (login, register)
│   │   └── (dashboard)/ # Protected dashboard pages
│   ├── components/       # Reusable components
│   ├── lib/             # Utilities, API client, types
│   ├── hooks/           # Custom React hooks
│   └── package.json
│
├── docker-compose.yml    # MySQL container setup
├── postman_collection.json
├── SCALING.md           # Production scaling guide
└── README.md
```

## 🚀 Deployment

### Backend
- Deploy to Railway, Render, or AWS EC2
- Set environment variables
- Run database migrations
- Configure CORS for production frontend URL

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Set `NEXT_PUBLIC_API_URL` environment variable
- Enable automatic deployments from Git

### Database
- Use managed MySQL: AWS RDS, PlanetScale, or Railway
- Enable connection pooling
- Set up automated backups

## 📈 Scaling for Production

See [SCALING.md](./SCALING.md) for comprehensive scaling strategies including:
- Horizontal scaling and load balancing
- Database optimization (indexing, read replicas)
- Caching strategies (Redis, CDN)
- Monitoring and logging
- Security hardening
- Infrastructure as Code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built as a demonstration of scalable full-stack web development practices.
