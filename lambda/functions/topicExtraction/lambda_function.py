import json
import os
from utils.groq_llm import GroqLLM
from utils.openai_llm import OpenAILLM
from utils.s3_utils import get_s3_object, put_s3_object
from utils.llm_interface import LLMInterface

def get_llm_provider(provider_name: str) -> LLMInterface:
    if provider_name == 'openai':
        return OpenAILLM()
    elif provider_name == 'groq':
        return GroqLLM()
    else:
        raise ValueError(f"Unknown LLM provider: {provider_name}")

def lambda_handler(event, context):
    if 'Records' not in event or not event['Records']:
        print("No records found in the event.")
        raise ValueError("No records found in the event")

    processed_count = 0
    llm_provider_name = os.getenv('LLM_PROVIDER', 'groq')
    llm = get_llm_provider(llm_provider_name)

    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        print(f"Processing S3 bucket: {bucket_name}, Key: {key}")

        ocr_text = get_s3_object(bucket_name, key).decode('utf-8')
        print("OCR'd text retrieved from S3.")

        topics = llm.extract_topics(ocr_text)
        print(f"Extracted topics: {topics}")

        output_bucket_name = 'spellbook-topic-extraction-results'
        output_key = f'topics/{key}'
        put_s3_object(output_bucket_name, output_key, json.dumps(topics))
        print(f"Extracted topics saved to S3 bucket: {output_bucket_name}, Key: {output_key}")

        processed_count += 1

    return {
        'statusCode': 200,
        'body': json.dumps('Topics extracted successfully and saved to S3'),
        'processedCount': processed_count
    }
