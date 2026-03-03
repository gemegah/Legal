"""Read-only matter routes for the starter backend slice."""

from fastapi import APIRouter, HTTPException, status

from app.schemas.matter import MatterDetail, MatterListItem
from app.services.matter_service import get_matter, list_matters

router = APIRouter()


@router.get("", response_model=list[MatterListItem])
async def get_matters() -> list[MatterListItem]:
    return list_matters()


@router.get("/{matter_id}", response_model=MatterDetail)
async def get_matter_by_id(matter_id: str) -> MatterDetail:
    matter = get_matter(matter_id)
    if not matter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Matter not found")
    return matter
