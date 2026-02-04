import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from core.deps import get_planilha_service
from schemas.upload import UploadResponse
from services.planilha_service import PlanilhaService

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_EXTENSIONS = (".xlsx", ".xls")


@router.post("/upload", response_model=UploadResponse)
async def upload_planilha(
    file: UploadFile = File(...),
    planilha_service: PlanilhaService = Depends(get_planilha_service),
) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nome do arquivo não fornecido")

    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Formato de arquivo não suportado. Use arquivos .xlsx ou .xls",
        )

    try:
        contents = await file.read()
    except Exception:
        logger.exception("Erro ao ler arquivo enviado")
        raise HTTPException(status_code=400, detail="Erro ao ler o arquivo enviado.") from None

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Arquivo vazio")

    try:
        resultado = planilha_service.process(contents, add_coordenadas=True)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception:
        logger.exception("Erro ao processar planilha")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar o arquivo. Tente novamente.",
        ) from None

    return UploadResponse(
        total_registros=resultado["total_registros"],
        colunas=resultado["colunas"],
        dados=resultado["dados"],
    )
