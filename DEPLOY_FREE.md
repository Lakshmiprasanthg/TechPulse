# 🆓 100% FREE Deployment Guide - TechPulse Blog

Complete guide to deploy TechPulse with **ZERO cost** using Render + Vercel.

---

## 📋 Prerequisites

- ✅ GitHub account (free)
- ✅ Render account (sign up at render.com)
- ✅ Vercel account (sign up at vercel.com)
- ✅ Your project code at `D:\task1`

---

## Step 1: Push Code to GitHub (Required)

Since you don't have Git installed, use **GitHub Desktop**:

### Option A: GitHub Desktop (Easiest)

1. **Download GitHub Desktop**: https://desktop.github.com
2. **Install and sign in** with your GitHub account
3. **Create new repository**:
   - File → New Repository
   - Name: `techpulse-blog`
   - Local Path: `D:\task1`
   - Initialize with README: ❌ (already exists)
   - Click "Create Repository"
4. **Initial commit**:
   - You'll see all files listed
   - Summary: "Initial commit - TechPulse Blog"
   - Click "Commit to main"
5. **Publish to GitHub**:
   - Click "Publish repository"
   - Keep it Public ✅ (required for free tier)
   - Click "Publish repository"

**Done!** Your code is now on GitHub.

---

### Option B: Using Git Commands (if you install Git)

```powershell
# Navigate to project
cd D:\task1

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TechPulse Blog"

# Create GitHub repo (via browser)
# Then connect and push
git remote add origin https://github.com/YOUR_USERNAME/techpulse-blog.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (easier)
3. Authorize Render to access GitHub

### 2.2 Create PostgreSQL Database (FREE)

1. From Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `techpulse-db`
   - **Database**: `techpulse`
   - **User**: (auto-generated)
   - **Region**: Oregon (best free tier)
   - **Plan**: **Free** ✅
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning
6. **Copy the Internal Database URL** - you'll need this!

### 2.3 Deploy Backend Service

1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click "Connect" next to `techpulse-blog`
   - Authorize if prompted
4. Configure service:
   - **Name**: `techpulse-backend`
   - **Region**: Oregon (same as database)
   - **Branch**: main
   - **Root Directory**: `backend` (important!)
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npx prisma migrate deploy && npm start
     ```
   - **Plan**: **Free** ✅

5. **Add Environment Variables** (click "Advanced"):
   ```
   DATABASE_URL = [Paste your PostgreSQL Internal URL from step 2.2]
   JWT_SECRET = your-super-secret-jwt-key-change-this-12345
   JWT_EXPIRES_IN = 1h
   NODE_ENV = production
   PORT = 5000
   CORS_ORIGIN = https://your-vercel-app.vercel.app (update after Step 3)
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL**: `https://techpulse-backend.onrender.com`

### ⚠️ Important: Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- This is normal for free tier - your app still works!

---

## Step 3: Deploy Frontend to Vercel (2 minutes)

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access GitHub

### 3.2 Deploy Frontend

1. From Vercel Dashboard, click **"Add New"** → **"Project"**
2. Import `techpulse-blog` repository
3. Configure:
   - **Framework Preset**: Next.js ✅ (auto-detected)
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   
4. **Add Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://techpulse-backend.onrender.com` (your Render URL)

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. **Copy your frontend URL**: `https://techpulse-blog.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to **Render Dashboard**
2. Open your `techpulse-backend` service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN = https://techpulse-blog.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will automatically redeploy (2-3 minutes)

---

## Step 5: Test Your Deployment! 🎉

1. **Visit your frontend**: `https://techpulse-blog.vercel.app`
2. **Register a new account**:
   - Click "Register"
   - Enter name, email, password
   - Submit
   - ⚠️ First request may take 30-60s (cold start)
3. **Login** with your credentials
4. **Create a post** in the dashboard
5. **Test all features**: search, filter, edit, delete

---

## 🎯 Your FREE Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://techpulse-blog.vercel.app`
- **Backend API**: `https://techpulse-backend.onrender.com`
- **Database**: PostgreSQL on Render (accessed via backend)

---

## 🔧 Troubleshooting

### Issue: "Service Unavailable" on first visit
- **Cause**: Free tier cold start
- **Solution**: Wait 30-60 seconds and refresh
- **Prevention**: None on free tier (premium eliminates this)

### Issue: CORS errors in browser console
- **Cause**: CORS_ORIGIN mismatch
- **Solution**: Verify CORS_ORIGIN in Render matches your Vercel URL exactly

### Issue: Database connection failed
- **Cause**: Wrong DATABASE_URL
- **Solution**: Copy Internal Database URL from Render PostgreSQL dashboard

### Issue: JWT errors
- **Cause**: JWT_SECRET not set
- **Solution**: Add JWT_SECRET in Render environment variables

### Issue: Build failed on Render
- **Cause**: Wrong Root Directory
- **Solution**: Set Root Directory to `backend` in Render settings

### Issue: Build failed on Vercel
- **Cause**: Wrong Root Directory or missing env var
- **Solution**: Set Root Directory to `frontend` and add NEXT_PUBLIC_API_URL

---

## 📊 Free Tier Limits

### Render Free Tier:
- ✅ 750 hours/month (enough for 24/7)
- ✅ 512MB RAM
- ✅ Shared CPU
- ⚠️ Spins down after 15min inactivity
- ✅ 0.5GB PostgreSQL storage
- ✅ Auto SSL certificate

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ No cold starts
- ✅ Auto SSL certificate
- ✅ Global CDN

### What This Means:
- Your frontend is **always fast** ⚡
- Your backend has **cold starts** but works fine 🐢
- Perfect for portfolio/learning projects ✅
- Not ideal for production with high traffic ⚠️

---

## 🚀 Going Live Checklist

- [ ] GitHub repository created and pushed
- [ ] Render PostgreSQL database created
- [ ] Render backend service deployed
- [ ] Vercel frontend deployed
- [ ] CORS_ORIGIN updated on backend
- [ ] Test registration working
- [ ] Test login working
- [ ] Test creating posts
- [ ] Test search and filter
- [ ] Share your live link! 🎉

---

## 📱 Next Steps (Optional)

1. **Custom Domain** (free with Vercel):
   - Buy domain ($10-15/year)
   - Add to Vercel project
   - Update CORS_ORIGIN on backend

2. **Monitoring** (free):
   - Use Render dashboard for backend logs
   - Use Vercel Analytics for frontend metrics

3. **Upgrade Later** (if needed):
   - Render: $7/month (no cold starts)
   - Vercel: Free tier is usually enough!

---

## 💡 Tips

- **Minimize cold starts**: Visit your app once every 15 minutes (or upgrade)
- **Use Vercel Analytics**: Free insights into your users
- **Check Render logs**: If something breaks, logs are your friend
- **Keep backups**: GitHub is your backup - commit often!

---

## 🎉 Congratulations!

Your TechPulse blog is now live on the internet for **FREE**! 

Share your link: `https://techpulse-blog.vercel.app`

---

**Need help?** Check:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Desktop: https://docs.github.com/en/desktop
