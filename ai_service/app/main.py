"""FastAPI entrypoint for the LegalOS AI service."""

from fastapi import FastAPI

app = FastAPI(title="LegalOS AI Service", version="0.1.0")


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
