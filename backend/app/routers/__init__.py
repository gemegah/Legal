"""API router registry for wired backend slices."""

from fastapi import APIRouter

from app.routers.documents import router as documents_router
from app.routers.cases import router as cases_router

api_router = APIRouter()
api_router.include_router(cases_router, prefix="/cases", tags=["cases"])
api_router.include_router(documents_router, tags=["documents"])
