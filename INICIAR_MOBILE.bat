@echo off
setlocal
cd /d "%~dp0frontend-mobile"
if not exist ".env" copy ".env.example" ".env" >nul
if not exist "node_modules" (
  echo Instalando as dependencias Mobile pela primeira vez...
  call npm install
  if errorlevel 1 goto erro
)
echo Iniciando ElderConnect Mobile (Expo)...
call npx expo start
if errorlevel 1 goto erro
exit /b 0
:erro
echo Falha ao iniciar. Confira Node.js, npm e conexao com a Internet.
pause
exit /b 1
