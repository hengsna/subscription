@echo off
setlocal
title Deploy EduVault to Vercel (Production)
color 0A
cls

echo ======================================================================
echo    EDUVAULT E-LEARNING PLATFORM - VERCEL PRODUCTION DEPLOYMENT
echo    Account: chanveasnaheng19@gmail.com (chanveasnaheng19-9108)
echo    Project: subscription
echo ======================================================================
echo.

:: 1. Verify Vercel login / link
echo [INFO] Linking to Vercel project 'subscription'...
call npx vercel link --yes --project subscription
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Failed to link Vercel project.
    pause
    exit /b 1
)

:: 2. Deploy to Production
echo.
echo [INFO] Deploying to Production on Vercel...
call npx vercel --prod --yes

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] Deployed successfully to Vercel!
    echo Production URL: https://subscription-ecru-ten.vercel.app
    echo ======================================================================
    echo.
    :: Open in Google Chrome (NEVER Microsoft Edge)
    set "CHROME_BIN="
    if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe"
    ) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    ) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
        set "CHROME_BIN=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    )

    if defined CHROME_BIN (
        start "" "!CHROME_BIN!" "https://subscription-ecru-ten.vercel.app"
    ) else (
        start https://subscription-ecru-ten.vercel.app
    )
) else (
    color 0C
    echo.
    echo [ERROR] Vercel deployment encountered an issue.
)

echo.
pause
