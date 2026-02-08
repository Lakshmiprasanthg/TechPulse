# Quick Deployment Guide for TechPulse

Since Git is not installed on your system, here are the easiest deployment options:

## Option 1: Deploy via Web Interface (Recommended - No Git Required)

### Step 1: Prepare Your Code
Your code is ready at `D:\task1`. You just need to zip it or use the web upload.

### Step 2: Deploy Backend to Railway
1. **Go to [Railway.app](https://railway.app)**
2. Click "Start a New Project"
3. Choose "Deploy from GitHub" OR "Empty Project"
4. If using Empty Project:
   - Click "New" → "Empty Service"
   - Click on the service → "Settings"
   - Under "Source", use Railway CLI or manual deploy (see below)

**Alternative: Use Railway CLI**
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd D:\task1\backend

# Initialize and deploy
railway init
railway up
```

**Environment Variables for Railway:**
```
DATABASE_URL=<Railway will provide this from PostgreSQL plugin>
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=1h
PORT=5000
NODE_ENV=production
CORS_ORIGIN=<your-vercel-frontend-url>
```

### Step 3: Deploy Frontend to Vercel
1. **Go to [Vercel.com](https://vercel.com)**
2. Click "Add New" → "Project"
3. Import your project (see options below)

**Alternative: Use Vercel CLI**
```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd D:\task1\frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Scope: Your account
# - Link to existing project? No
# - Project name: techpulse
# - Directory: ./
# - Override settings? No
```

**Environment Variables for Vercel:**
```
NEXT_PUBLIC_API_URL=<your-railway-backend-url>
```

---

## Option 2: Use GitHub Desktop (Easiest for Beginners)

### Step 1: Install GitHub Desktop
1. Download from [desktop.github.com](https://desktop.github.com)
2. Install and sign in with GitHub account

### Step 2: Create Repository
1. In GitHub Desktop: File → New Repository
2. Name: `techpulse-blog`
3. Local Path: Browse to `D:\task1`
4. Click "Create Repository"
5. Click "Publish repository" to push to GitHub

### Step 3: Deploy Backend to Railway
1. Go to [Railway.app](https://railway.app)
2. "Start a New Project" → "Deploy from GitHub repo"
3. Select `techpulse-blog` repository
4. Railway detects Node.js automatically
5. Add PostgreSQL database:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-creates `DATABASE_URL`
6. Configure backend:
   - Click on backend service
   - Settings → Environment:
     - Update `DATABASE_URL` (automatically connected)
     - Add other env vars (see above)
   - Settings → Root Directory: `backend`
   - Settings → Start Command: `npm run build && npm start`

### Step 4: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. "Add New" → "Project" → "Import Git Repository"
3. Select `techpulse-blog` repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
5. Click "Deploy"

---

## Option 3: Manual Deployment without Git

### For Backend (Using Render.com - Simpler than Railway)
1. **Go to [Render.com](https://render.com)**
2. Click "New" → "Web Service"
3. Choose "Build and deploy from a Git repository" OR "Deploy an existing image"
4. **Without Git**: Use Render's "Deploy via Git" but zip and upload manually:
   - Create account
   - Go to Dashboard
   - Use their manual deployment option

### For Frontend (Using Netlify Drop)
1. **Go to [app.netlify.com/drop](https://app.netlify.com/drop)**
2. Build your frontend first:
   ```powershell
   cd D:\task1\frontend
   npm run build
   ```
3. Drag and drop the `.next` folder to Netlify Drop
4. **Note**: This won't work for Next.js - you need Vercel

---

## Recommended Path (Simplest)

### Without Git Installation:

**For Backend:**
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd D:\task1\backend
railway login
railway init
railway up

# Add database
railway add postgresql

# Set environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
```

**For Frontend:**
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd D:\task1\frontend
vercel login
vercel

# Set environment variable after deployment
vercel env add NEXT_PUBLIC_API_URL
# Enter your Railway backend URL when prompted
```

---

## What You Need

### Before Deploying:
- ✅ Code is ready (Done!)
- ✅ Backend and Frontend tested locally (Done!)
- ⚠️ Git installed (Optional - can use CLI tools)
- ⚠️ GitHub account (Recommended)
- ✅ Railway account (Free tier available)
- ✅ Vercel account (Free tier available)

### After Deployment:
1. Update CORS in backend to allow your Vercel domain
2. Update frontend API URL to point to Railway backend
3. Test registration and login
4. Monitor logs for any errors

---

## Quick Start Commands

```powershell
# Install deployment tools
npm install -g @railway/cli vercel

# Deploy Backend
cd D:\task1\backend
railway login
railway init
railway add postgresql
railway up

# Deploy Frontend
cd D:\task1\frontend
vercel login
vercel

# Set frontend env variable
vercel env add NEXT_PUBLIC_API_URL
```

---

## Need Help?

**Railway Documentation**: https://docs.railway.app  
**Vercel Documentation**: https://vercel.com/docs  
**Contact Support**: Both platforms have excellent Discord communities

Choose the option that works best for you! The CLI method (Option 3) is fastest if you don't want to set up Git right now.
