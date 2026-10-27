@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Installer Node.js 22 LTS puis relancer ce fichier.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm run web
pause
