from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AlphaDock API",
    version="0.1.0",
    description="Docking job orchestration and agent tools (MVP scaffold).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "alphadock-api"}


@app.get("/api/v1/meta")
def meta() -> dict[str, str]:
    return {"name": "alphadock", "api_version": "v1"}
