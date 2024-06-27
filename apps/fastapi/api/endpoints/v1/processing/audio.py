import openai

from api.config import settings


def transcribe_with_whisper(file_path: str) -> str:
    """Helper function to transcribe audio using OpenAI Whisper."""
    openai.api_key = settings.OPENAI_API_KEY

    with open(file_path, "rb") as audio_file:
        transcription = openai.Audio.transcribe("whisper-1", audio_file)

    return transcription["text"]
