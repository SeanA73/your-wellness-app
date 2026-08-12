@echo off
title FitMatePro Development Server
color 0A
echo ========================================
echo    FitMatePro Development Server
echo ========================================
echo.
echo Starting server...
echo.
echo IMPORTANT: Keep this window open!
echo The server will be available at:
echo   http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"

REM Check if node is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

echo Starting development server...
echo.

npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ERROR: Server failed to start!
    echo ========================================
    echo.
    echo Check the error messages above for details.
    echo.
    pause
)
