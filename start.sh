#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit 0
}

# Trap SIGINT (Ctrl+C) and run cleanup
trap cleanup SIGINT

echo "🚀 Starting WanderAI Project..."

# Start Backend
echo "🐍 Starting Python Backend (Port 8000)..."
cd backend

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "⚛️  Starting Next.js Frontend (Port 3000)..."
npm run dev

# Wait for frontend to exit
wait
