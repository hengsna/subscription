@echo off
setlocal enabledelayedexpansion
title Open EduVault in Google Chrome

set "CHROME_BIN="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_BIN=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) else (
    for /f "delims=" %%i in ('where chrome 2^>nul') do set "CHROME_BIN=%%i"
)

if not defined CHROME_BIN (
    echo [ERROR] Google Chrome was not found on your system.
    echo Please install Chrome from https://www.google.com/chrome/
    pause
    exit /b 1
)

echo [INFO] Launching Google Chrome on http://localhost:3000 ...
start "" "!CHROME_BIN!" "http://localhost:3000"
start "" "!CHROME_BIN!" "%~dp0eduvault_e_learning_platform.html"
exit /b 0
