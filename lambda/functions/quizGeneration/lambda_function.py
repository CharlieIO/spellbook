import os, json
from utils.openai_llm import OpenAILLM
from utils.groq_llm import GroqLLM
from utils.s3_utils import get_s3_object_as_text

def get_llm_provider(provider_name: str):
    if provider_name == 'openai':
        return OpenAILLM()
    elif provider_name == 'groq':
        return GroqLLM()
    else:
        raise ValueError(f"Unknown LLM provider: {provider_name}")

def lambda_handler(event, context):
    # Extract parameters from the event
    note_keys = event['noteKeys']
    num_questions = event['numQuestions']
    
    # Get the LLM provider from environment variable
    provider_name = os.environ.get('LLM_PROVIDER', 'groq')
    llm_provider = get_llm_provider(provider_name)

    # Fetch the note content from S3
    s3_bucket_name = 'spellbook-imagestore-ocr-results'
    notes = []
    for note_key in note_keys:
        s3_key = f'processed/{note_key}'
        note_content = get_s3_object_as_text(s3_bucket_name, s3_key)
        notes.append(note_content)

    # Generate quiz using the LLM provider
    quiz = llm_provider.generate_quiz(notes, num_questions)
    
    # Return the generated quiz as a JSON object
    return {
        'statusCode': 200,
        'body': quiz
    }

