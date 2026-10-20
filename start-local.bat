@echo off
title EduVault E-Learning Platform - Local Runner
color 0A
cls

echo ======================================================================
echo    EDUVAULT E-LEARNING PLATFORM - AUTOMATED LOCAL RUNNER
echo ======================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo Please install Node.js (v18+) from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo [OK] NPM version:
call npm -v
echo.

:: 2. Check if node_modules exists, otherwise install dependencies
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

:: 3. Launch browser automatically after 3 seconds in background
echo [INFO] Launching EduVault Web App on http://localhost:3000 ...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: 4. Start Next.js Development Server
echo [INFO] Starting Next.js development server...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
call npm run dev

pause
