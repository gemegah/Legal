"""FastAPI app factory, middleware registration, and router wiring."""

from fastapi import FastAPI

app = FastAPI(title="LegalOS API", version="0.1.0")


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
