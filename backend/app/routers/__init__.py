"""API router registry for wired backend slices."""

from fastapi import APIRouter

from app.routers.documents import router as documents_router
from app.routers.matters import router as matters_router

api_router = APIRouter()
api_router.include_router(matters_router, prefix="/matters", tags=["matters"])
api_router.include_router(documents_router, tags=["documents"])
