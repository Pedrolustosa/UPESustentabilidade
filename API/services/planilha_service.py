import math
from typing import Any, Dict, List

import pandas as pd

from services.protocols import CoordenadasEnricherProtocol, ExcelReaderProtocol

SHEET_PROJETOS = "PROJETOS"


def _to_json_safe(value: Any) -> Any:
    if value is None:
        return None
    try:
        if pd.isna(value):
            return None
    except (TypeError, ValueError):
        pass
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return None
    if isinstance(value, (int, float, str, bool)):
        return value
    return str(value) if value is not None else None


def _dataframe_to_records(df: pd.DataFrame) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        item: Dict[str, Any] = {}
        for key, val in row.items():
            cleaned = _to_json_safe(val)
            item[key] = cleaned if cleaned is not None else ""
        records.append(item)
    return records


class PlanilhaService:
    def __init__(
        self,
        reader: ExcelReaderProtocol,
        enricher: CoordenadasEnricherProtocol,
    ):
        self._reader = reader
        self._enricher = enricher

    def process(
        self,
        contents: bytes,
        add_coordenadas: bool = True,
    ) -> Dict[str, Any]:
        try:
            df = self._reader.read_sheet(contents, SHEET_PROJETOS)
        except (ValueError, KeyError) as e:
            err = str(e).lower()
            if "projetos" in err or "worksheet" in err or "not found" in err:
                raise ValueError("A planilha deve conter uma aba chamada 'PROJETOS'") from e
            raise ValueError(
                "Erro ao ler a planilha. Verifique se o arquivo está no formato Excel válido."
            ) from e
        except Exception as e:
            raise ValueError(
                "Erro ao ler a planilha. Verifique se o arquivo está no formato Excel válido."
            ) from e

        if df.empty:
            raise ValueError("A planilha está vazia")

        df = self._reader.normalize_columns(df)
        dados = _dataframe_to_records(df)

        if add_coordenadas:
            dados = self._enricher.enrich(dados)

        return {
            "total_registros": len(dados),
            "colunas": df.columns.tolist(),
            "dados": dados,
        }
