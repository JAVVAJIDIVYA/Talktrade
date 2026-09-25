@echo off
echo ====================================
echo Starting Talk Trade Application
echo ====================================
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm run dev"

timeout /t 3

echo Starting Frontend Server...
start cmd /k "cd client && npm run dev"

echo.
echo ====================================
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ====================================
echo.
echo Press any key to exit this window...
pause
