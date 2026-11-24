@echo off
setlocal
cd /d "%~dp0frontend-web"
if not exist ".env" copy ".env.example" ".env" >nul
if not exist "node_modules" (
  echo Instalando as dependencias Web pela primeira vez...
  call npm install
  if errorlevel 1 goto erro
)
echo Iniciando ElderConnect Web...
call npm run dev
if errorlevel 1 goto erro
exit /b 0
:erro
echo Falha ao iniciar. Confira se Node.js 22 e npm estao instalados.
pause
exit /b 1
