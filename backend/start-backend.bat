@echo off
echo Starting TH-TOURISM Backend Server...
cd /d "%~dp0"
node node_modules\ts-node\dist\bin.js src\server.ts
pause
