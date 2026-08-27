import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth import router as auth_router
from api.agents import router as agents_router
from api.documents import router as documents_router
from api.chat import router as chat_router
from api.dashboard import router as dashboard_router


app = FastAPI(
    title="Enterprise AI Copilot API",
    version="0.1.0",
)


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        FRONTEND_URL,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




app.include_router(auth_router)
app.include_router(agents_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "Enterprise AI Copilot API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }