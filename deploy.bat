@echo off
title GitHub Auto Deploy
color 0E
echo ===================================================
echo   MEMULAI PROSES SINKRONISASI KE GITHUB ^& VERCEL
echo ===================================================
echo.

:: Menanyakan deskripsi perbaikan kepada pengguna
set msg=
set /p msg="Masukkan deskripsi perbaikan/fitur (tekan ENTER untuk default): "
if "%msg%"=="" (
    set msg=Auto Update dari Komputer (%date% %time%)
)

echo.
echo Sedang mendeteksi dan mengunggah perubahan ke GitHub...
echo.

"C:\Program Files\Git\cmd\git.exe" add .

:: Commit perubahan (abaikan jika tidak ada perubahan baru)
"C:\Program Files\Git\cmd\git.exe" commit -m "%msg%" >nul 2>&1

:: Push ke GitHub
"C:\Program Files\Git\cmd\git.exe" push origin master
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ===================================================
    echo   [ERROR] GAGAL MENGUNGGAH KE GITHUB!
    echo   Periksa koneksi internet Anda atau pastikan tidak ada konflik kode.
    echo ===================================================
    echo.
    pause
    exit /b
)

color 0A
echo.
echo ===================================================
echo   BERHASIL DIUNGGAH KE GITHUB!
echo   Vercel sedang memproses dan memperbarui website Anda secara otomatis.
echo   Silakan cek website Anda dalam 1-2 menit.
echo ===================================================
echo.
pause
