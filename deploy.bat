@echo off
title GitHub Auto Deploy
color 0A
echo ===================================================
echo   MEMULAI PROSES SINKRONISASI KE GITHUB ^& VERCEL
echo ===================================================
echo.
echo Sedang mengunggah perubahan kode Anda ke GitHub...

"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Auto Update dari Komputer"
"C:\Program Files\Git\cmd\git.exe" push origin master

echo.
echo ===================================================
echo   BERHASIL DIUNGGAH KE GITHUB!
echo   Vercel sedang memproses dan memperbarui website Anda secara otomatis.
echo   Silakan cek website Anda dalam 1-2 menit.
echo ===================================================
echo.
pause
