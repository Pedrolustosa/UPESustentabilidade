# UPE Sustentabilidade

Sistema para visualização e gestão de projetos de sustentabilidade da Universidade de Pernambuco (UPE). Permite importar planilhas Excel com projetos, enriquecer dados com coordenadas dos campi e exibir um mapa interativo, dashboard com indicadores e tabela de dados.

**System for viewing and managing sustainability projects at the University of Pernambuco (UPE). It allows importing Excel spreadsheets with projects, enriching data with campus coordinates, and displaying an interactive map, dashboard with indicators, and data table.**

---

## Índice | Table of contents

- [Português (Brasil)](#português-brasil)
- [English](#english)

---

# Português (Brasil)

## Visão geral

O repositório é um **monorepo** com dois projetos principais:

| Pasta | Descrição |
|-------|-----------|
| **API** | Backend em FastAPI que processa planilhas Excel, normaliza colunas e adiciona coordenadas (lat/lng) aos projetos com base no campus. |
| **APP/upe-mapa** | Frontend em React que consome a API, exibe mapa (Leaflet), dashboard com KPIs, gráficos por campus/ODS, filtros e tabela de dados. |

O fluxo principal: o usuário faz upload de um arquivo `.xlsx` ou `.xls` pela interface; a API lê a aba **PROJETOS**, normaliza colunas, identifica o campus de cada projeto e enriquece os registros com `latitude` e `longitude`; o frontend exibe os projetos no mapa por campus, em gráficos e em tabela, com filtros por campus e ODS.

## Arquitetura

```
UPESustentabilidade/
├── API/                    # Backend FastAPI
│   ├── main.py             # App FastAPI, CORS, rotas
│   ├── core/               # Configuração e injeção de dependências
│   ├── controllers/        # Rotas (health, upload)
│   ├── schemas/            # Modelos Pydantic (respostas)
│   ├── services/           # Lógica de negócio (planilha, campus, leitor Excel)
│   ├── requirements.txt
│   └── Dockerfile
└── APP/
    └── upe-mapa/           # Frontend React
        ├── src/
        │   ├── api/        # Cliente HTTP (axios) para a API
        │   ├── components/ # Header, MapView, Drawer, KPICards, etc.
        │   ├── pages/      # Dashboard
        │   └── utils/      # Campos de projeto, coordenadas de campus
        ├── package.json
        └── public/
```

## API (Backend)

### Tecnologias

- **Python 3.12**, FastAPI, Pydantic v2, Uvicorn  
- Pandas, openpyxl (leitura de Excel)  
- Configuração via Pydantic Settings (`.env`)

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check. Retorna `{"status":"ok","version":"1.0.0"}`. |
| `POST` | `/api/v1/upload` | Upload de planilha Excel. Corpo: `multipart/form-data` com campo `file`. Retorna total de registros, colunas e dados enriquecidos (com `latitude`, `longitude`, `campus_encontrado`). |

### Formato da planilha

- **Obrigatório:** uma aba nomeada exatamente **PROJETOS**.
- Formatos aceitos: `.xlsx`, `.xls`.
- Colunas são normalizadas (minúsculas, espaços → `_`). O backend procura campus em colunas como: `professor_unidade_ensino`, `unidade_ensino`, `campus`, `unidade`, etc. Se não houver coordenadas na planilha, elas são preenchidas automaticamente com base no nome do campus (lista de campi UPE no `CampusService`).

### Resposta do upload

```json
{
  "total_registros": 42,
  "colunas": ["titulo_projeto", "campus", "ods", "professor", ...],
  "dados": [
    {
      "titulo_projeto": "Nome do projeto",
      "campus": "Recife",
      "latitude": -8.0476,
      "longitude": -34.877,
      "campus_encontrado": "Recife",
      ...
    }
  ]
}
```

### Configuração (API)

Variáveis de ambiente (opcional, há valores padrão em `core/config.py`):

- `cors_origins` – origens permitidas (ex.: `http://localhost:3000`).
- `api_prefix` – prefixo das rotas da API (padrão: `/api/v1`).
- `max_upload_size` – tamanho máximo do upload em bytes (padrão: 10 MB).

### Executar a API localmente

```bash
cd API
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Documentação interativa: `http://127.0.0.1:8000/docs`.

### Executar com Docker (API)

```bash
cd API
docker build -t upe-sustentabilidade-api .
docker run -p 8000:8000 upe-sustentabilidade-api
```

## APP (Frontend – upe-mapa)

### Tecnologias

- **React 19**, Create React App  
- Leaflet / react-leaflet (mapa)  
- Axios (chamadas à API)  
- Bootstrap 5, React Toastify  

### Funcionalidades

- **Upload:** envio de planilha para a API; exibição do resultado (total de registros e dados no estado da aplicação).
- **Mapa:** marcadores por campus com agrupamento; ao clicar em um campus, drawer lateral com lista de projetos e busca.
- **Dashboard:** resumo do último upload; KPIs (total de projetos, com/sem localização, campi ativos); gráficos de barras por campus e por ODS; banner de aviso para projetos sem localização.
- **Filtros:** por campus e ODS; busca textual.
- **Visualizações:** aba Mapa e aba Tabela de Dados.
- **Tabela:** exibição tabular dos projetos com colunas dinâmicas e suporte aos filtros.

### Configuração da API no frontend

O base URL da API é definido em `APP/upe-mapa/src/api/api.js`:

- **Produção/nuvem:** `https://upe-sustentabilidades-api.azurewebsites.net`
- **Local:** comentado: `// baseURL: 'http://127.0.0.1:8000'`

Para desenvolvimento local, comente a URL da nuvem e descomente a do `127.0.0.1:8000`.

### Executar o frontend

```bash
cd APP/upe-mapa
npm install
npm start
```

Abre em `http://localhost:3000`. O build de produção: `npm run build`.

## Formato de dados no frontend

O frontend espera que cada projeto tenha (após normalização/enriquecimento da API) campos que podem vir com nomes variados. Os helpers em `src/utils/projetoFields.js` tratam isso:

- **Título:** `titulo_projeto`, `titulo`, `nome_projeto`, `projeto`
- **Campus:** `campus_padrao`, `campus_encontrado`, `professor_unidade_ensino`, `unidade_ensino`, `campus`
- **ODS:** `1º Ods`, `1º_ods`, `ods`, `primeiro_ods`
- **Abrangência:** `abrangencia`, `abrangência`
- **Professor:** `professor`, `professor_responsavel`, `responsavel`
- **Coordenadas:** `latitude`, `longitude` (numéricos válidos para exibir no mapa)

## Desenvolvimento

1. Subir a API (local ou Docker) na porta 8000.
2. No frontend, apontar `api.js` para a API desejada (local ou Azure).
3. Rodar `npm start` em `APP/upe-mapa` e fazer o upload de uma planilha com aba PROJETOS para validar o fluxo.

---

# English

## Overview

This repository is a **monorepo** containing two main projects:

| Folder | Description |
|--------|-------------|
| **API** | FastAPI backend that processes Excel spreadsheets, normalizes columns, and adds coordinates (lat/lng) to projects based on campus. |
| **APP/upe-mapa** | React frontend that consumes the API and displays an interactive map (Leaflet), dashboard with KPIs, charts by campus/ODS, filters, and data table. |

Main flow: the user uploads an `.xlsx` or `.xls` file through the UI; the API reads the **PROJETOS** sheet, normalizes columns, identifies each project’s campus, and enriches records with `latitude` and `longitude`; the frontend displays projects on the map by campus, in charts, and in a table, with filters by campus and ODS.

## Architecture

```
UPESustentabilidade/
├── API/                    # FastAPI backend
│   ├── main.py             # FastAPI app, CORS, routes
│   ├── core/               # Config and dependency injection
│   ├── controllers/        # Routes (health, upload)
│   ├── schemas/            # Pydantic models (responses)
│   ├── services/           # Business logic (spreadsheet, campus, Excel reader)
│   ├── requirements.txt
│   └── Dockerfile
└── APP/
    └── upe-mapa/           # React frontend
        ├── src/
        │   ├── api/        # HTTP client (axios) for the API
        │   ├── components/ # Header, MapView, Drawer, KPICards, etc.
        │   ├── pages/      # Dashboard
        │   └── utils/      # Project fields, campus coordinates
        ├── package.json
        └── public/
```

## API (Backend)

### Tech stack

- **Python 3.12**, FastAPI, Pydantic v2, Uvicorn  
- Pandas, openpyxl (Excel reading)  
- Configuration via Pydantic Settings (`.env`)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check. Returns `{"status":"ok","version":"1.0.0"}`. |
| `POST` | `/api/v1/upload` | Excel spreadsheet upload. Body: `multipart/form-data` with `file` field. Returns total records, column names, and enriched data (with `latitude`, `longitude`, `campus_encontrado`). |

### Spreadsheet format

- **Required:** one sheet named exactly **PROJETOS**.
- Accepted formats: `.xlsx`, `.xls`.
- Column names are normalized (lowercase, spaces → `_`). The backend looks for campus in columns such as: `professor_unidade_ensino`, `unidade_ensino`, `campus`, `unidade`, etc. If the spreadsheet has no coordinates, they are filled automatically from the campus name (UPE campus list in `CampusService`).

### Upload response

```json
{
  "total_registros": 42,
  "colunas": ["titulo_projeto", "campus", "ods", "professor", ...],
  "dados": [
    {
      "titulo_projeto": "Project name",
      "campus": "Recife",
      "latitude": -8.0476,
      "longitude": -34.877,
      "campus_encontrado": "Recife",
      ...
    }
  ]
}
```

### Configuration (API)

Environment variables (optional; defaults in `core/config.py`):

- `cors_origins` – allowed origins (e.g. `http://localhost:3000`).
- `api_prefix` – API route prefix (default: `/api/v1`).
- `max_upload_size` – max upload size in bytes (default: 10 MB).

### Run the API locally

```bash
cd API
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Interactive docs: `http://127.0.0.1:8000/docs`.

### Run with Docker (API)

```bash
cd API
docker build -t upe-sustentabilidade-api .
docker run -p 8000:8000 upe-sustentabilidade-api
```

## APP (Frontend – upe-mapa)

### Tech stack

- **React 19**, Create React App  
- Leaflet / react-leaflet (map)  
- Axios (API calls)  
- Bootstrap 5, React Toastify  

### Features

- **Upload:** send spreadsheet to the API; show result (total records and data in app state).
- **Map:** markers per campus with clustering; clicking a campus opens a side drawer with project list and search.
- **Dashboard:** last upload summary; KPIs (total projects, with/without location, active campuses); bar charts by campus and by ODS; banner for projects without location.
- **Filters:** by campus and ODS; text search.
- **Views:** Map tab and Data Table tab.
- **Table:** tabular view of projects with dynamic columns and filter support.

### API configuration in the frontend

The API base URL is set in `APP/upe-mapa/src/api/api.js`:

- **Production/cloud:** `https://upe-sustentabilidades-api.azurewebsites.net`
- **Local:** commented out: `// baseURL: 'http://127.0.0.1:8000'`

For local development, comment the cloud URL and uncomment the `127.0.0.1:8000` one.

### Run the frontend

```bash
cd APP/upe-mapa
npm install
npm start
```

Opens at `http://localhost:3000`. Production build: `npm run build`.

## Data format in the frontend

The frontend expects each project to have (after API normalization/enrichment) fields that may come under different names. The helpers in `src/utils/projetoFields.js` handle this:

- **Title:** `titulo_projeto`, `titulo`, `nome_projeto`, `projeto`
- **Campus:** `campus_padrao`, `campus_encontrado`, `professor_unidade_ensino`, `unidade_ensino`, `campus`
- **ODS:** `1º Ods`, `1º_ods`, `ods`, `primeiro_ods`
- **Scope (abrangência):** `abrangencia`, `abrangência`
- **Professor:** `professor`, `professor_responsavel`, `responsavel`
- **Coordinates:** `latitude`, `longitude` (valid numbers to show on the map)

## Development

1. Run the API (local or Docker) on port 8000.
2. In the frontend, point `api.js` to the desired API (local or Azure).
3. Run `npm start` in `APP/upe-mapa` and upload a spreadsheet with a PROJETOS sheet to validate the flow.
