from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.health_controller import router as health_router
from controllers.upload_controller import router as upload_router
from core.config import settings

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(
    upload_router,
    prefix=settings.api_prefix,
    tags=["Upload"],
)
