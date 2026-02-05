from fastapi import APIRouter
from pydantic import BaseModel

from core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = ""


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", version=settings.api_version)
