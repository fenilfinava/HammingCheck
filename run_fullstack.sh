#!/usr/bin/env bash
# ==============================================================
# Hamming(7,4) Full-Stack Web Suite Launcher
# Starts FastAPI Backend (Port 8000) & Next.js Frontend (Port 3000)
# ==============================================================

echo "=========================================================="
echo "🚀 Starting Hamming(7,4) Full-Stack Technical Defense Suite"
echo "=========================================================="

# Kill any existing processes on ports 8000 and 3000
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 1. Start Python FastAPI Backend
echo ">>> [1/2] Launching Python FastAPI Backend on http://localhost:8000..."
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait 2 seconds for backend to initialize
sleep 2

# Verify backend health
curl -s http://localhost:8000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✔ Backend successfully initialized!"
else
    echo "⚠ Backend starting in progress..."
fi

# 2. Start Next.js Frontend
echo ">>> [2/2] Launching Next.js Frontend on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================================="
echo "🎉 Full-Stack Web Suite is Running!"
echo "👉 Open Web Dashboard in your browser: http://localhost:3000"
echo "👉 FastAPI Swagger API Docs:          http://localhost:8000/docs"
echo "👉 Press Ctrl+C in this terminal to stop both servers."
echo "=========================================================="

# Trap SIGINT to kill background processes on Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
