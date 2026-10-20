# EduVault E-Learning Platform - Automated PowerShell Runner
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   EDUVAULT E-LEARNING PLATFORM - AUTOMATED LOCAL RUNNER" -ForegroundColor Green
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

# 2. Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# 3. Schedule automatic browser open
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
} | Out-Null

Write-Host "[INFO] Starting Next.js server on http://localhost:3000 ..." -ForegroundColor Green
Write-Host "[INFO] Your default browser will open automatically in 3 seconds." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

npm run dev
