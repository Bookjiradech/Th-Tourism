@echo off
echo =========================================
echo   Starting TH-TOURISM Backend Server
echo =========================================
echo.
echo Checking environment...
cd /d "%~dp0"

echo Killing old Node processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo Starting server...
node node_modules\ts-node\dist\bin.js src\server.ts

pause
