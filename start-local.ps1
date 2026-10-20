# EduVault E-Learning Platform - Automated Google Chrome Runner
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   EDUVAULT E-LEARNING PLATFORM - GOOGLE CHROME RUNNER" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found in system PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Exit 1
}

$nodeVer = node -v
$npmVer = npm -v
Write-Host "[OK] Node.js: $nodeVer | NPM: $npmVer" -ForegroundColor Cyan

# 2. Locate Google Chrome
$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromeExe = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromeExe = $path
        break
    }
}

if ($chromeExe) {
    Write-Host "[OK] Detected Google Chrome: $chromeExe" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Google Chrome not found at standard paths." -ForegroundColor Yellow
}

# 3. Free Port 3000 if occupied
$occupied = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($occupied) {
    Write-Host "[INFO] Freeing occupied port 3000..." -ForegroundColor Yellow
    Stop-Process -Id $occupied.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 4. Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# 5. Launch Chrome after 3 seconds
Start-Job -ScriptBlock {
    param($exe)
    Start-Sleep -Seconds 3
    if ($exe) {
        Start-Process $exe "http://localhost:3000"
    } else {
        Start-Process "http://localhost:3000"
    }
} -ArgumentList $chromeExe | Out-Null

Write-Host ""
Write-Host "[INFO] Starting Next.js server bound to 0.0.0.0:3000 ..." -ForegroundColor Green
Write-Host "[INFO] Google Chrome will open automatically on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Accessible at:" -ForegroundColor Cyan
Write-Host "  - http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - http://127.0.0.1:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

npm run dev
