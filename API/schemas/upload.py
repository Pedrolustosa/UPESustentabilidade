from typing import Any, Dict, List

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    total_registros: int = Field(...)
    colunas: List[str] = Field(...)
    dados: List[Dict[str, Any]] = Field(...)

    model_config = {
        "json_schema_extra": {
            "example": {
                "total_registros": 10,
                "colunas": ["nome", "campus"],
                "dados": [],
            }
        }
    }
