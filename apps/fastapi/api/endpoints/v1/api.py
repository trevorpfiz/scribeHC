from fastapi import APIRouter

from api.endpoints.v1.routers import health, upload

api_router = APIRouter()


api_router.include_router(
    health.router,
    prefix="/health",
    tags=["health"],
    responses={404: {"description": "Not found"}},
)
api_router.include_router(
    upload.router,
    prefix="/upload",
    tags=["upload"],
    responses={404: {"description": "Not found"}},
)
