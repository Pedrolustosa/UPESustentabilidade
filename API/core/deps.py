from services.campus_service import CampusService
from services.file_reader_service import ExcelReader
from services.planilha_service import PlanilhaService


def get_planilha_service() -> PlanilhaService:
    return PlanilhaService(reader=ExcelReader(), enricher=CampusService())
