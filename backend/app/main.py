from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.donations import router as donations_router
from app.api.routes.health import router as health_router
from app.api.routes.volunteers import router as volunteers_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "Non-persistent demonstration API for the Love 21 volunteer and "
        "donation journeys."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(health_router)
app.include_router(volunteers_router, prefix="/api/v1")
app.include_router(donations_router, prefix="/api/v1")

