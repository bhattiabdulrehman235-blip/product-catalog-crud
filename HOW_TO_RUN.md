# How to Run This Project

You need two terminals open at the same time: one for the backend, one for the frontend.

## Terminal 1 — Backend (FastAPI)

```
cd "d:/claude code/CRUD_web/backend"
```

**First time only** (creates the virtual environment and installs packages):
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Every time after that:**
```
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Activation command depends on your shell:
- Command Prompt (cmd.exe): `venv\Scripts\activate`
- PowerShell: `.\venv\Scripts\Activate.ps1`
- Git Bash: `source venv/Scripts/activate`

Backend will run at: http://127.0.0.1:8000

## Terminal 2 — Frontend (React + Vite)

```
cd "d:/claude code/CRUD_web/frontend"
```

**First time only:**
```
npm install
```

**Every time after that:**
```
npm run dev
```

Frontend will run at: http://localhost:5173

## Using the app

Open http://localhost:5173 in your browser. The backend must already be running, since the frontend calls it for all product data.

## Stopping the servers

Click into each terminal and press `Ctrl+C`.

## If you see "port already in use" or a socket permission error

Something is already running on that port (usually a server you forgot to stop). Find and close it:

```
netstat -ano | findstr :8000
taskkill /PID <the_pid_shown> /F
```

Replace `8000` with `5173` if it's the frontend port that's stuck.
