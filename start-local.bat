@echo off
setlocal enabledelayedexpansion
title EduVault E-Learning Platform - Local Runner
color 0A
cls

echo ======================================================================
echo    EDUVAULT E-LEARNING PLATFORM - GOOGLE CHROME LOCAL RUNNER
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

:: 2. Locate Google Chrome (Do NOT use Microsoft Edge)
set "CHROME_BIN="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) else (
    where chrome >nul 2>nul
    if !ERRORLEVEL! equ 0 (
        for /f "delims=" %%i in ('where chrome') do set "CHROME_BIN=%%i"
    )
)

if defined CHROME_BIN (
    echo [OK] Detected Google Chrome: "!CHROME_BIN!"
) else (
    echo [WARNING] Google Chrome not found at standard paths.
    echo [NOTICE] Will open in your preferred browser.
)
echo.

:: 3. Free Port 3000 if occupied
echo [INFO] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [INFO] Freeing occupied port 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>nul
)

:: 4. Check if node_modules exists, otherwise install dependencies
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

:: 5. Launch Google Chrome in 3 seconds (NEVER Microsoft Edge)
echo [INFO] Launching EduVault in Google Chrome on http://localhost:3000 ...
if defined CHROME_BIN (
    start "" cmd /c "timeout /t 3 /nobreak >nul & start \"\" \"!CHROME_BIN!\" \"http://localhost:3000\""
) else (
    start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
)

:: 6. Start Next.js Development Server bound to 0.0.0.0:3000
echo [INFO] Starting Next.js development server (0.0.0.0:3000)...
echo [INFO] Accessible via:
echo        - http://localhost:3000
echo        - http://127.0.0.1:3000
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ======================================================================
echo.

call npm run dev

pause
