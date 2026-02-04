from io import BytesIO

import pandas as pd


class ExcelReader:
    def read_sheet(self, contents: bytes, sheet_name: str) -> pd.DataFrame:
        buffer = BytesIO(contents)
        df = pd.read_excel(buffer, sheet_name=sheet_name, engine="openpyxl")
        if df.empty:
            raise ValueError("A planilha está vazia")
        return df

    def normalize_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df.columns = (
            df.columns.astype(str)
            .str.strip()
            .str.lower()
            .str.replace(" ", "_", regex=False)
            .str.replace("º", "", regex=False)
        )
        return df
