from typing import Any, Dict, List, Protocol

import pandas as pd


class ExcelReaderProtocol(Protocol):
    def read_sheet(self, contents: bytes, sheet_name: str) -> pd.DataFrame: ...
    def normalize_columns(self, df: pd.DataFrame) -> pd.DataFrame: ...


class CoordenadasEnricherProtocol(Protocol):
    def enrich(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]: ...
