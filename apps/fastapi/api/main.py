import logging

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from api.config import settings
from api.endpoints.v1.api import api_router

info_router = APIRouter()


@info_router.get("/", status_code=200, include_in_schema=False)
async def info():
    return [{"Status": "API Running"}]


def custom_generate_unique_id(route: APIRoute):
    """Generates a custom ID when using the TypeScript Generator Client

    Args:
        route (APIRoute): The route to be customised

    Returns:
        str: tag-route_name, e.g. items-CreateItem
    """
    return f"{route.tags[0]}-{route.name}"


def get_application():
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        generate_unique_id_function=custom_generate_unique_id,
        root_path=settings.ROOT,
        root_path_in_servers=True,
        openapi_url=settings.openapi_url,
    )

    origins = ["http://localhost:3000/"]  # TODO: Change to your production URL

    if settings.ENVIRONMENT == "development":
        logger = logging.getLogger("uvicorn")
        logger.warning("Running in development mode - allowing CORS for all origins")
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    _app.include_router(api_router, prefix=settings.API_VERSION)
    _app.include_router(info_router, tags=[""])

    return _app


app = get_application()
