import json
import logging
import textwrap

from openai import OpenAI

from api.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

if settings.ENVIRONMENT == "development":
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.WARNING)


def generate_soap(transcript: str) -> str:
    """Helper function to generate soap note from transcript using OpenAI Chat Completions API."""
    logging.info("Generating soap note")

    sample_transcript = textwrap.dedent("""
    The patient is a 25-year-old right-handed Caucasian female who presented to the emergency department with sudden onset of headache occurring at approximately 11 a.m. on the morning of the July 31, 2008. She described the headache as the worst in her life and it was also accompanied by blurry vision and scotoma. The patient also perceived some swelling in her face. Once in the Emergency Department, the patient underwent a very thorough evaluation and examination. She was given the migraine cocktail. Also was given morphine a total of 8 mg while in the Emergency Department. For full details on the history of present illness, please see the previous history and physical.

    Doctor: How're you feeling today?
    Patient: Terrible. I'm having the worst headache of my life.
    Doctor: I'm so sorry. Well you are only twenty-five, so let's hope this is the last of the worst. Let's see how we can best help you. When did it start?
    Patient: Around eleven in the morning.
    Doctor: Today?
    Patient: Um no yesterday. July thirty-first.
    Doctor: July thirty-first O eight. Got it. Did it come on suddenly?
    Patient: Yeah.
    Doctor: Are you having any symptoms with it, such as blurry vision, light sensitivity, dizziness, lightheadedness, or nausea?
    Patient: I'm having blurry vision and lightheadedness. I also can't seem to write well. It looks so messy. I am naturally right-handed but my writing looks like I am trying with my left.
    Doctor: How would you describe the lightheadedness?
    Patient: Like there are blind spots.
    Doctor: Okay. How about any vomiting?
    Patient: Um no. I feel like my face is pretty swollen though. I don't know if it's related to the headache but it started around the same time.
    Doctor: Here in the ER, we'll do a thorough exam and eval to make sure nothing serious is going on. While we're waiting for your CT results, I'm going to order a migraine cocktail and some Morphine.
    Patient: Thanks. Will the nurse be in soon?
    Doctor: Yes, she'll be right in as soon as the order is placed. It shouldn't be more than a few minutes. If it takes longer, then please ring the call bell.
    """)

    # Example format for Tiptap editor as a JSON string
    example_format = {
        "type": "doc",
        "content": [
            {
                "type": "heading",
                "attrs": {"level": 2},
                "content": [{"type": "text", "text": "Example heading"}],
            },
            {
                "type": "paragraph",
                "content": [{"type": "text", "text": "example paragraph"}],
            },
            {
                "type": "heading",
                "attrs": {"level": 3},
                "content": [{"type": "text", "text": "Features"}],
            },
            {
                "type": "orderedList",
                "attrs": {"tight": True, "start": 1},
                "content": [
                    {
                        "type": "listItem",
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {"type": "text", "text": "Example list item"}
                                ],
                            },
                        ],
                    },
                    {
                        "type": "listItem",
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {"type": "text", "text": "AI autocomplete (type "},
                                    {
                                        "type": "text",
                                        "marks": [{"type": "code"}],
                                        "text": "++",
                                    },
                                    {
                                        "type": "text",
                                        "text": " to activate, or select from slash menu)",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }
    example_format_str = json.dumps(example_format)

    # Call the OpenAI Chat Completions API
    completion = client.chat.completions.create(
        model="gpt-4o",  # gpt-4o, gpt-3.5-turbo
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant designed to output JSON.",
            },
            {
                "role": "user",
                "content": f"Generate a SOAP note from the following transcript and return it in JSON format for a Tiptap editor. This is the example format: {example_format_str}. The text fields can not be left blank, so try your best to fill them out. Transcript: {transcript}",
            },
        ],
    )

    logging.debug(f"SOAP: {completion.choices[0].message.content}")
    return completion.choices[0].message.content
