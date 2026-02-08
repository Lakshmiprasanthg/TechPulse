# Setup Guide - Task1 Web Application

This guide will walk you through setting up and running the Task1 web application locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Docker Desktop** (for MySQL database) - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

Verify installations:
```powershell
node --version  # Should be v18+
npm --version
docker --version
```

---

## Step 1: Start MySQL Database

The project includes a Docker Compose file for easy database setup.

```powershell
# Navigate to project directory
cd d:\task1

# Start MySQL container
docker-compose up -d

# Verify container is running
docker ps
```

You should see a container named `task1_mysql` running on port 3306.

**Database Credentials:**
- Host: `localhost`
- Port: `3306`
- Database: `task1_db`
- Username: `task1_user`
- Password: `task1_password`
- Root Password: `rootpassword`

---

## Step 2: Setup Backend

### Install Dependencies

```powershell
cd backend
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Prisma (database ORM)
- JWT libraries
- TypeScript and development tools

### Configure Environment Variables

The `.env` file is already created with default values. Review and modify if needed:

```powershell
# View .env file
cat .env
```

### Initialize Database

Run Prisma migrations to create database tables:

```powershell
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

This creates the `users` and `posts` tables in your MySQL database.

### (Optional) Seed Database

To add sample data for testing:

```powershell
# Create a seed script (optional)
# You can manually create users via the API or frontend
```

### Start Backend Server

```powershell
# Development mode with hot reload
npm run dev
```

The backend API will start on **http://localhost:5000**

You should see:
```
🚀 Server is running on port 5000
📍 Environment: development
🔗 CORS enabled for: http://localhost:3000
```

---

## Step 3: Setup Frontend

Open a **new PowerShell terminal** (keep backend running).

### Install Dependencies

```powershell
cd d:\task1\frontend
npm install
```

This installs:
- Next.js (React framework)
- TailwindCSS (styling)
- React Hook Form & Zod (form validation)
- TanStack Query (data fetching)
- Axios (HTTP client)

### Configure Environment Variables

The `.env.local` file is already created. Verify it points to the backend:

```powershell
# View .env.local
cat .env.local
```

Should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Start Frontend Development Server

```powershell
npm run dev
```

The frontend will start on **http://localhost:3000**

You should see:
```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

---

## Step 4: Verify Installation

### Backend Health Check

Open your browser or use curl:

```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-08T..."
}
```

### Frontend Access

1. Open browser: **http://localhost:3000**
2. You should see the home page with Login/Register buttons

---

## Step 5: Test the Application

### Register a New User

1. Click **Register** button on home page
2. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123` (min 8 characters)
   - Confirm Password: `password123`
3. Click **Sign Up**
4. You'll be automatically logged in and redirected to the dashboard

### Create Your First Post

1. In the dashboard, click **Create New Post** or navigate to **Posts** → **Create Post**
2. Fill in the form:
   - Title: `My First Blog Post`
   - Excerpt: `This is a test post`
   - Content: `Hello world! This is my first blog post on this platform.`
   - Status: Select `Published`
3. Click **Create Post**
4. You'll see your post in the posts list

### Test Search and Filter

1. Go to **Posts** page
2. Try searching: Enter text in search box
3. Try filtering: Select status (Draft/Published) from dropdown
4. Test pagination if you have many posts

---

## Troubleshooting

### Backend Issues

**Problem:** `Error: P1001: Can't reach database server`

**Solution:**
```powershell
# Check if MySQL container is running
docker ps

# Restart container if needed
docker-compose restart

# Check logs
docker logs task1_mysql
```

**Problem:** `JWT_SECRET is not defined`

**Solution:** Ensure `.env` file exists in backend folder with `JWT_SECRET` set.

**Problem:** Port 5000 already in use

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in backend/.env
```

### Frontend Issues

**Problem:** `NEXT_PUBLIC_API_URL is not defined`

**Solution:** Ensure `.env.local` file exists in frontend folder.

**Problem:** `Cannot connect to backend`

**Solution:**
- Verify backend is running on http://localhost:5000
- Check CORS settings in backend
- Clear browser cache and reload

**Problem:** Port 3000 already in use

**Solution:**
```powershell
# Next.js will automatically use port 3001 if 3000 is taken
# Or explicitly set port:
$env:PORT=3001; npm run dev
```

### Database Issues

**Problem:** Prisma migrations fail

**Solution:**
```powershell
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Try migration again
npx prisma migrate dev
```

**Problem:** Can't connect to MySQL

**Solution:**
```powershell
# Verify DATABASE_URL in backend/.env
# Test connection with Prisma Studio
npx prisma studio
```

---

## Using Postman for API Testing

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `postman_collection.json` from project root
4. Collection "Task1 Web App API" will be imported

### Setup Environment

1. Create a new environment in Postman
2. Add variables:
   - `base_url`: `http://localhost:5000/api`
   - `jwt_token`: (leave empty, will be auto-populated)

### Test API Flow

1. **Register User**
   - Open "Authentication" → "Register User"
   - Click **Send**
   - JWT token will be automatically saved to `jwt_token` variable

2. **Login User**
   - Open "Authentication" → "Login User"
   - Update email/password in body
   - Click **Send**

3. **Get Profile**
   - Open "Authentication" → "Get Profile"
   - Ensure "Bearer Token" auth is enabled
   - Click **Send**

4. **Create Post**
   - Open "Posts" → "Create Post"
   - Modify request body
   - Click **Send**

5. **Get All Posts**
   - Open "Posts" → "Get All Posts"
   - Try adding query parameters (search, status, page, limit)
   - Click **Send**

---

## Database Management with Prisma Studio

Prisma Studio provides a visual interface to view and edit database records.

```powershell
cd backend
npx prisma studio
```

Opens browser at **http://localhost:5555**

You can:
- View all users and posts
- Edit records directly
- Delete records
- Add new records manually

---

## Development Tips

### Hot Reload

- **Backend:** Changes to `.ts` files auto-restart server (via `ts-node-dev`)
- **Frontend:** Changes to React components auto-reload browser

### Clear Caches

If you experience issues after changes:

```powershell
# Frontend - clear Next.js cache
cd frontend
rm -r -force .next
npm run dev

# Backend - clear node_modules and reinstall
cd backend
rm -r -force node_modules
npm install
```

### View Logs

**Backend:** Logs appear in terminal where `npm run dev` is running

**Frontend:** 
- Server logs: Terminal output
- Client logs: Browser console (F12 → Console tab)

### Database Queries

View actual SQL queries Prisma generates:

```powershell
# In backend/.env, add:
# DATABASE_URL="mysql://...?connection_limit=5"

# Prisma will log queries in development mode
```

---

## Production Build

### Build Backend

```powershell
cd backend
npm run build
npm start
```

### Build Frontend

```powershell
cd frontend
npm run build
npm start
```

---

## Next Steps

✅ Application is running!

Now you can:

1. **Explore Features:**
   - User registration and login
   - Create, edit, delete blog posts
   - Search and filter posts
   - Update profile

2. **Read Documentation:**
   - [README.md](../README.md) - Project overview
   - [SCALING.md](../SCALING.md) - Production scaling guide
   - API documentation in Postman collection

3. **Customize:**
   - Modify UI components in `frontend/components/`
   - Add new API endpoints in `backend/src/routes/`
   - Extend database schema in `backend/prisma/schema.prisma`

4. **Deploy:**
   - Backend: Railway, Render, AWS EC2, Heroku
   - Frontend: Vercel (recommended), Netlify, AWS Amplify
   - Database: AWS RDS, PlanetScale, Railway

---

## Quick Reference Commands

### Start Everything

```powershell
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend; npm run dev

# Terminal 3: Frontend
cd frontend; npm run dev
```

### Stop Everything

```powershell
# Stop backend/frontend: Ctrl+C in each terminal

# Stop database
docker-compose down
```

### Reset Database

```powershell
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

### Update Dependencies

```powershell
# Backend
cd backend; npm update

# Frontend
cd frontend; npm update
```

---

## Support

If you encounter issues not covered in this guide:

1. Check error messages in terminal
2. Review logs in browser console (F12)
3. Verify all services are running (MySQL, backend, frontend)
4. Check environment variables are correctly set
5. Ensure ports 3000, 3306, and 5000 are not blocked by firewall

---

**Happy Coding! 🚀**
