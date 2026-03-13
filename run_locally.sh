#!/bin/bash
# run_locally.sh
# This script starts the backend and the production frontend.

echo ">>> Starting Backend on Port 8000..."
cd backend
source venv/bin/activate
# Start backend in background
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

echo ">>> Building and Starting Frontend (Production)..."
cd web
npm install
npm run build
# Start frontend in foreground
npm start

# If frontend exits, kill backend
kill $BACKEND_PID
