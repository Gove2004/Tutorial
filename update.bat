@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo === Scanning courses ===

python scan.py

echo.
echo === Git push ===
git add -A
git status --short
git commit -m "update courses"
git push

echo.
echo Done!
pause
