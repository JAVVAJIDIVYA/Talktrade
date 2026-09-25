@echo off
echo ====================================
echo Talk Trade - Setup Script
echo ====================================
echo.

echo Installing Backend Dependencies...
cd server
call npm install
cd ..

echo.
echo Installing Frontend Dependencies...
cd client
call npm install
cd ..

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next Steps:
echo 1. Update server/.env with your MongoDB connection string
echo 2. Run 'start.bat' to launch the application
echo.
pause
