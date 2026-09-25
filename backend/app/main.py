import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1 import admin, ai

from sqlalchemy import text

# Create tables and ensure pgvector extension is installed
try:
    with engine.connect() as conn:
        try:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
        except Exception as ve:
            print(f"Notice: pgvector extension check: {ve}")
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database initialization error (check connection state): {e}")

app = FastAPI(title="Professor AI Platform")

# CORS configuration: allow localhost development ports
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])

@app.on_event("startup")
def startup_event():
    import threading
    from app.services.rag import warmup_rag
    threading.Thread(target=warmup_rag, daemon=True).start()

@app.get("/")
def root():
    return {"message": "Professor API is running"}