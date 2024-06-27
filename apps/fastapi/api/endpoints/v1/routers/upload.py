import os
import tempfile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from api.endpoints.v1.auth.verify import verify_token
from api.endpoints.v1.processing.audio import transcribe_with_whisper

router = APIRouter()


@router.post("", status_code=200)
async def transcribe_audio(
    file: UploadFile = File(...), user: str = Depends(verify_token)
):
    """Endpoint to upload and process audio files with OpenAI Whisper."""
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        transcription = transcribe_with_whisper(temp_file_path)

        return JSONResponse(
            content={
                "message": f"File processed successfully by user {user}",
                "transcription": transcription,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
