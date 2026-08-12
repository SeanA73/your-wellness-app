# PowerShell script to check and start the dev server
Write-Host "=== FitMatePro Server Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js 20+ from nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "2. Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found!" -ForegroundColor Red
    exit 1
}

# Check dependencies
Write-Host "3. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ node_modules not found! Running 'npm install'..." -ForegroundColor Yellow
    npm install
}

# Check environment file
Write-Host "4. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠ .env file not found - you may need to create it" -ForegroundColor Yellow
}

# Check port 8080
Write-Host "5. Checking port 8080..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "   ⚠ Port 8080 is in use by PID: $($portInUse.OwningProcess)" -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "   Process: $($process.ProcessName)" -ForegroundColor Yellow
        Write-Host "   You may need to stop this process first" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✓ Port 8080 is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Starting Development Server ===" -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev



