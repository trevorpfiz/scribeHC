from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from api.endpoints.v1.auth.verify import verify_token

router = APIRouter()


@router.get("", status_code=200)
async def check(user: str = Depends(verify_token)):
    """Secured health check endpoint."""
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return JSONResponse(
        status_code=200,
        content={
            "message": "Service is running smoothly",
            "batches_processed": 0,
            "title": "title",
            "content": "content",
            "transcript": "hi",
        },
    )
