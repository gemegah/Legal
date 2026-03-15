"""Read-only case routes for the starter backend slice."""

from fastapi import APIRouter, HTTPException, status

from app.schemas.case import CaseDetail, CaseListItem
from app.services.case_service import get_case, list_cases

router = APIRouter()


@router.get("", response_model=list[CaseListItem])
async def get_cases() -> list[CaseListItem]:
    return list_cases()


@router.get("/{case_id}", response_model=CaseDetail)
async def get_case_by_id(case_id: str) -> CaseDetail:
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return case
