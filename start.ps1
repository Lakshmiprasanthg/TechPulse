# Quick Start Script for Task1 Web Application
# Run this script to start all services

Write-Host "🚀 Starting Task1 Web Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "📦 Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Start MySQL container
Write-Host "🗄️  Starting MySQL database..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MySQL database started" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start MySQL database" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Wait for MySQL to be ready
Write-Host "⏳ Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "✅ MySQL is ready" -ForegroundColor Green
Write-Host ""

# Setup backend if not already done
Write-Host "🔧 Setting up backend..." -ForegroundColor Yellow
if (!(Test-Path "backend\node_modules")) {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Gray
    Push-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

# Run Prisma migrations
Push-Location backend
Write-Host "   Running database migrations..." -ForegroundColor Gray
npx prisma generate | Out-Null
npx prisma migrate dev --name init 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend setup complete" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database migrations may have already been run" -ForegroundColor Yellow
}
Pop-Location
Write-Host ""

# Setup frontend if not already done
Write-Host "🎨 Setting up frontend..." -ForegroundColor Yellow
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Gray
    Push-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}
Write-Host "✅ Frontend setup complete" -ForegroundColor Green
Write-Host ""

# Instructions for starting servers
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, open TWO PowerShell terminals:" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then open your browser to:" -ForegroundColor White
Write-Host "  🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  🔌 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Read SETUP.md for detailed instructions" -ForegroundColor Gray
Write-Host "📮 Import postman_collection.json for API testing" -ForegroundColor Gray
Write-Host ""
