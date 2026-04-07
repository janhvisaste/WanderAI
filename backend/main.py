from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, hotels, trip

app = FastAPI(
    title="WanderAI API",
    description="AI-Powered Trip Planning Backend",
    version="2.0.0",
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(chat.router)
app.include_router(hotels.router)
app.include_router(trip.router)


@app.get("/")
async def root():
    return {"message": "WanderAI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
