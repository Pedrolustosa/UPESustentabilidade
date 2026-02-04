from typing import Any, Dict, List, Optional

DEFAULT_COORDENADAS: Dict[str, float] = {"lat": -8.0476, "lng": -34.8770}

CAMPUS_COORDENADAS: Dict[str, Dict[str, float]] = {
    "recife": {"lat": -8.0476, "lng": -34.8770},
    "garanhuns": {"lat": -8.8903, "lng": -36.4931},
    "petrolina": {"lat": -9.3887, "lng": -40.5027},
    "caruaru": {"lat": -8.2842, "lng": -35.9699},
    "nazaré da mata": {"lat": -7.7417, "lng": -35.2278},
    "salgueiro": {"lat": -8.0739, "lng": -39.1197},
    "serra talhada": {"lat": -7.9919, "lng": -38.2983},
    "arcoverde": {"lat": -8.4208, "lng": -37.0556},
    "belo jardim": {"lat": -8.3356, "lng": -36.4244},
    "pesqueira": {"lat": -8.3578, "lng": -36.6967},
    "vitória de santo antão": {"lat": -8.1181, "lng": -35.2914},
    "palmares": {"lat": -8.6833, "lng": -35.5917},
    "goiana": {"lat": -7.5606, "lng": -35.0028},
    "limoeiro": {"lat": -7.8739, "lng": -35.4503},
    "cabo de santo agostinho": {"lat": -8.2833, "lng": -35.0333},
    "igarassu": {"lat": -7.8339, "lng": -34.9061},
    "olinda": {"lat": -8.0017, "lng": -34.8550},
    "jaboatão dos guararapes": {"lat": -8.1128, "lng": -35.0147},
    "paulista": {"lat": -7.9408, "lng": -34.8731},
    "abreu e lima": {"lat": -7.9117, "lng": -34.9028},
    "camaragibe": {"lat": -8.0236, "lng": -34.9781},
    "são lourenço da mata": {"lat": -8.0017, "lng": -35.0181},
    "carpina": {"lat": -7.8506, "lng": -35.2544},
    "surubim": {"lat": -7.8331, "lng": -35.7547},
    "bezerros": {"lat": -8.2333, "lng": -35.7833},
    "gravatá": {"lat": -8.2011, "lng": -35.5658},
    "escola de aplicação": {"lat": -8.0476, "lng": -34.8770},
    "campus recife": {"lat": -8.0476, "lng": -34.8770},
    "campus garanhuns": {"lat": -8.8903, "lng": -36.4931},
    "campus petrolina": {"lat": -9.3887, "lng": -40.5027},
    "campus caruaru": {"lat": -8.2842, "lng": -35.9699},
}

PALAVRAS_CHAVE_CAMPUS: Dict[str, str] = {
    "recife": "recife",
    "garanhuns": "garanhuns",
    "petrolina": "petrolina",
    "caruaru": "caruaru",
    "nazare": "nazaré da mata",
    "salgueiro": "salgueiro",
    "serra talhada": "serra talhada",
    "arcoverde": "arcoverde",
    "belo jardim": "belo jardim",
    "pesqueira": "pesqueira",
    "vitoria": "vitória de santo antão",
    "santo antao": "vitória de santo antão",
    "palmares": "palmares",
    "goiana": "goiana",
    "limoeiro": "limoeiro",
    "cabo": "cabo de santo agostinho",
    "igarassu": "igarassu",
    "olinda": "olinda",
    "jaboatao": "jaboatão dos guararapes",
    "guararapes": "jaboatão dos guararapes",
    "paulista": "paulista",
    "abreu": "abreu e lima",
    "camaragibe": "camaragibe",
    "sao lourenco": "são lourenço da mata",
    "lourenco": "são lourenço da mata",
    "carpina": "carpina",
    "surubim": "surubim",
    "bezerros": "bezerros",
    "gravata": "gravatá",
}

COLUNAS_CAMPUS = [
    "professor_unidade_ensino",
    "professor_unidade_ensino_",
    "professor_unidade_ensino__",
    "unidade_ensino",
    "unidade_ensino_",
    "campus",
    "campus_",
    "unidade",
    "unidade_",
    "professor_unidade",
    "unidade_de_ensino",
]


class CampusService:
    def _normalize_name(self, nome: str) -> str:
        if not nome or not isinstance(nome, str):
            return ""
        result = nome.strip().lower()
        for char, replacement in {
            "á": "a", "à": "a", "â": "a", "ã": "a", "ä": "a",
            "é": "e", "è": "e", "ê": "e", "ë": "e",
            "í": "i", "ì": "i", "î": "i", "ï": "i",
            "ó": "o", "ò": "o", "ô": "o", "õ": "o", "ö": "o",
            "ú": "u", "ù": "u", "û": "u", "ü": "u",
            "ç": "c",
        }.items():
            result = result.replace(char, replacement)
        return result

    def get_coordenadas(self, nome_campus: str) -> Optional[Dict[str, float]]:
        if not nome_campus:
            return None
        key = self._normalize_name(nome_campus)
        if key in CAMPUS_COORDENADAS:
            return CAMPUS_COORDENADAS[key]
        for campus_key, coords in CAMPUS_COORDENADAS.items():
            if campus_key in key or key in campus_key:
                return coords
        for palavra, campus in PALAVRAS_CHAVE_CAMPUS.items():
            if palavra in key:
                return CAMPUS_COORDENADAS.get(campus)
        return CAMPUS_COORDENADAS.get("recife")

    def _extract_campus_from_projeto(self, projeto: Dict[str, Any]) -> Optional[str]:
        for coluna in COLUNAS_CAMPUS:
            if coluna in projeto and projeto[coluna]:
                valor = projeto[coluna]
                if valor and str(valor).strip():
                    return valor
        for key, value in projeto.items():
            if not isinstance(key, str) or not isinstance(value, (str, int, float)):
                continue
            if any(p in key.lower() for p in ["campus", "unidade", "ensino", "local"]):
                valor_str = str(value).strip()
                if valor_str and valor_str.lower() not in ("nan", "none", "", "null"):
                    return valor_str
        return None

    def enrich(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        result: List[Dict[str, Any]] = []
        for projeto in data:
            row = projeto.copy()
            campus = self._extract_campus_from_projeto(projeto)
            coords = self.get_coordenadas(str(campus) if campus else "")
            if coords:
                row["latitude"] = coords["lat"]
                row["longitude"] = coords["lng"]
            else:
                row["latitude"] = DEFAULT_COORDENADAS["lat"]
                row["longitude"] = DEFAULT_COORDENADAS["lng"]
            row["campus_encontrado"] = str(campus) if campus else "Não identificado"
            result.append(row)
        return result
