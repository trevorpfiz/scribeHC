import io
import logging

from openai import OpenAI

from api.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

if settings.ENVIRONMENT == "development":
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.WARNING)


def transcribe_with_whisper(
    filename: str, file_like: io.BytesIO, content_type: str
) -> str:
    """Helper function to transcribe audio using OpenAI Whisper."""
    logging.info("Transcribing with whisper")

    # Prepare the file data as a tuple
    file_data = (filename, file_like.read(), content_type)

    # Call the OpenAI API to transcribe the audio file
    transcription = client.audio.transcriptions.create(
        model="whisper-1", file=file_data
    )

    logging.debug(f"Transcription: {transcription.text}")
    return transcription
