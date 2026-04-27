@echo off
title Data Pelita - Installer
color 0B

echo ===================================================
echo.
echo    Instalasi Aplikasi Data Pelita
echo.
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/5] Mengecek Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Node.js belum terinstall!
    echo Silakan download dan install Node.js versi LTS dari https://nodejs.org/
    echo Setelah selesai, jalankan kembali file ini.
    pause
    exit /b
)
echo Node.js terdeteksi.
echo.

echo [2/5] Menginstal dependensi aplikasi...
echo Mohon tunggu, proses ini membutuhkan koneksi internet...
call npm install
echo.

echo [3/5] Mengecek file environment (.env)...
if not exist ".env" (
    echo Membuat file .env untuk koneksi database SQLite...
    echo DATABASE_URL="file:./dev.db" > .env
) else (
    echo File .env sudah ada.
)
echo.

echo [4/5] Menyiapkan database dan Prisma Client...
call npx prisma generate
call npx prisma db push
echo.

echo [5/5] Menjalankan seed admin default...
:: Ini akan error diam-diam jika admin sudah ada (karena email unik), dan itu tidak masalah.
node create-admin.js >nul 2>&1
echo Setup database selesai.
echo.

echo ===================================================
echo.
echo    INSTALASI SELESAI!
echo.
echo    Aplikasi sudah siap digunakan di laptop ini.
echo    Silakan klik ganda file 'jalankan_layanan.bat'
echo    untuk menyalakan server aplikasi.
echo.
echo ===================================================
pause
