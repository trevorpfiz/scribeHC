import logging
import io

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse

from api.config import settings
from api.endpoints.v1.auth.verify import verify_token
from api.endpoints.v1.processing.audio import transcribe_with_whisper

router = APIRouter()

if settings.ENVIRONMENT == "development":
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.WARNING)

# OpenAI Whisper supports the following file types
ALLOWED_FILE_TYPES = [
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
    "video/mp4",
    "video/mpeg"
]
# OpenAI Whisper file uploads are currently limited to 25 MB
FILE_SIZE_LIMIT = 25 * 1024 * 1024  # 25 MB in bytes

@router.post("", status_code=200)
async def transcribe_audio(
    background_tasks: BackgroundTasks, file: UploadFile = File(...), user: str = Depends(verify_token), 
):
    """Endpoint to upload and process audio files with OpenAI Whisper."""
    
    logging.info(f"Transcribing audio file: {file.filename}")
    logging.debug(f"Audio file mime type: {file.content_type}")

    # Check file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Check file size
    contents = await file.read()
    logging.debug(f"size: {len(contents)} bytes")
    if len(contents) > FILE_SIZE_LIMIT:
        raise HTTPException(status_code=400, detail="File size exceeds 25 MB limit")
    
    try:
        # Use BytesIO to handle the file in-memory
        file_like = io.BytesIO(contents)

        # Reset the buffer's position to the start (not needed with await?)
        file_like.seek(0)
        
        # Add a background task to close the buffer after processing
        background_tasks.add_task(file_like.close)
        
        # Pass the file-like object to the transcription function
        transcription = transcribe_with_whisper(file.filename, file_like, file.content_type)

        return JSONResponse(
            content={
                "message": f"File processed successfully by user {user}",
                "transcription": transcription.text,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
