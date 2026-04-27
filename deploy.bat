@echo off
title Vercel Auto Deploy
color 0B
echo ===================================================
echo   MEMULAI PROSES DEPLOYMENT KE PELITA-CLUB.VERCEL.APP
echo ===================================================
echo.
echo Sedang mengunggah perubahan terbaru Anda...
echo Mohon tunggu 1-3 menit hingga proses selesai.
echo.

call npx vercel --prod --yes

echo.
echo ===================================================
echo   DEPLOYMENT SELESAI!
echo   Website Anda sudah diperbarui.
echo ===================================================
echo.
pause
