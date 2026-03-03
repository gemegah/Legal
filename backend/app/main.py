"""FastAPI app factory, middleware registration, and router wiring."""

from fastapi import FastAPI

from app.routers import api_router

app = FastAPI(title="LegalOS API", version="0.1.0")


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")
