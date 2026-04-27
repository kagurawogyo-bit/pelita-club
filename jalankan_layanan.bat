@echo off
title Data Pelita - Web App
color 0A

echo ===================================================
echo.
echo    Memulai Layanan Data Pelita (Development Mode)
echo.
echo ===================================================
echo.

cd /d "%~dp0"

:: Mengecek apakah node_modules ada
if not exist "node_modules\" (
    echo Menginstal dependensi aplikasi...
    call npm install
)

echo Menjalankan server...
call npm run dev

pause
