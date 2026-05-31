@echo off
cd /d "%~dp0"
echo Iniciando Saude Prime...
start "Saude Prime — Servidor" py -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
timeout /t 3 /nobreak > nul
start "" http://127.0.0.1:8000
echo.
echo Servidor rodando em http://127.0.0.1:8000
echo Para parar: feche a janela "Saude Prime - Servidor"
