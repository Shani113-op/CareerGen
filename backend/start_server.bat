@echo off
setlocal

:: Load API URL from .env file (fallback to localhost:5000 if not set)
for /f "tokens=* usebackq" %%a in (".env") do (
    set "line=%%a"
    for /f "tokens=1,2 delims==" %%b in ("!line!") do (
        if "%%b"=="REACT_APP_API_URL" set "API_URL=%%c"
    )
)

if not defined API_URL set "API_URL=http://localhost:5000"

echo 🚀 Starting CareerGenAI Python Backend...
echo.
echo 📍 Server will be available at:
echo    • API: %API_URL%
echo    • Docs: %API_URL%/docs
echo    • Health: %API_URL%/health
echo.
echo 🔧 To stop the server, press Ctrl+C
echo ==========================================
echo.

uvicorn chatbot:app --host 0.0.0.0 --port 5000 --reload

pause
