import base64
import json
import os
from google.cloud.documentai_v1 import DocumentProcessorServiceClient
from google.oauth2 import service_account
from utils.s3_utils import get_s3_object, put_s3_object, head_s3_object
from utils.retry import retry_operation

PROCESSOR_ID = 'c2feb52c92e94301'
PROJECT_ID = 'notes-helper-383322'
LOCATION = 'us'
OUTPUT_BUCKET_NAME = 'spellbook-imagestore-ocr-results'

def lambda_handler(event, context):
    # Document AI setup
    credentials_json = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    if not credentials_json:
        print("Environment variable for GOOGLE_APPLICATION_CREDENTIALS_JSON is missing.")
        raise ValueError("Environment variable for GOOGLE_APPLICATION_CREDENTIALS_JSON is missing")
    credentials = service_account.Credentials.from_service_account_info(json.loads(credentials_json))
    client = DocumentProcessorServiceClient(credentials=credentials)
    name = client.processor_path(PROJECT_ID, LOCATION, PROCESSOR_ID)
    print("Google Document AI client initialized with processor path.")

    # Check if the event contains the necessary S3 information
    if 'Records' not in event or not event['Records']:
        print("No records found in the event.")
        raise ValueError("No records found in the event")

    processed_count = 0

    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        print(f"Processing S3 bucket: {bucket_name}, Key: {key}")

        # Get the document from S3 with retries
        document_content = retry_operation(get_s3_object, bucket_name, key)
        print("Document retrieved from S3.")

        # Retrieve the Content-Type from the metadata with retries
        response = retry_operation(head_s3_object, bucket_name, key)
        mime_type = response['ContentType']
        print(f"Retrieved Content-Type: {mime_type}")

        # Prepare the request to Document AI
        # Encode the document content in base64 if it's an image
        if mime_type.startswith('image/'):
            document_content = base64.b64encode(document_content).decode('utf-8')
        else:
            document_content = document_content.decode('utf-8')
        document = {"content": document_content, "mime_type": mime_type}
        request = {"name": name, "raw_document": document}
        print("Request prepared for Google Document AI.")

        # Process the document using Document AI with retries
        result = retry_operation(client.process_document, request=request)
        document_text = result.document.text
        print("Document processed by Google Document AI.")

        # Output the results to a different S3 bucket with retries
        output_key = f'processed/{key}'
        retry_operation(put_s3_object, OUTPUT_BUCKET_NAME, output_key, document_text)
        print(f"Processed document text saved to S3 bucket: {OUTPUT_BUCKET_NAME}, Key: {output_key}")

        processed_count += 1

    return {
        'statusCode': 200,
        'body': json.dumps('Document(s) processed successfully and saved to S3'),
        'processedCount': processed_count
    }
