# Launch Backend in new PowerShell window
Start-Process powershell -ArgumentList '-NoExit', '-Command', '& { $host.ui.RawUI.WindowTitle = "Backend - FastAPI (8000)"; Set-Location "e:\prabdeep\professor-site\backend"; & "e:\prabdeep\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload }'

# Launch Frontend in new PowerShell window
Start-Process powershell -ArgumentList '-NoExit', '-Command', '& { $host.ui.RawUI.WindowTitle = "Frontend - Next.js (3000)"; Set-Location "e:\prabdeep\professor-site\frontend"; npm run dev }'

Write-Host "Both Backend and Frontend terminals have been started." -ForegroundColor Green
