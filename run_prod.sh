#!/bin/bash

# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --port 8000 --reload &

# Terminal 2: Frontend (Production Mode)
cd ../web
npm run build
npm start
