@echo off
echo Starting Backend and Frontend servers...

start "Backend - FastAPI (8000)" cmd /k "cd /d e:\prabdeep\professor-site\backend && e:\prabdeep\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

start "Frontend - Next.js (3000)" cmd /k "cd /d e:\prabdeep\professor-site\frontend && npm run dev"

echo Both Backend and Frontend terminal windows have been launched!
