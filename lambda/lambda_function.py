import base64
import json
import os
import boto3
from google.cloud.documentai_v1 import DocumentProcessorServiceClient
from google.oauth2 import service_account


def lambda_handler(event, context):
    # Initialize AWS S3 client
    s3_client = boto3.client('s3')
    print("AWS S3 client initialized.")

    # Document AI setup
    credentials_json = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    if not credentials_json:
        print("Environment variable for GOOGLE_APPLICATION_CREDENTIALS_JSON is missing.")
        raise ValueError("Environment variable for GOOGLE_APPLICATION_CREDENTIALS_JSON is missing")
    credentials = service_account.Credentials.from_service_account_info(json.loads(credentials_json))
    client = DocumentProcessorServiceClient(credentials=credentials)
    processor_id = 'c2feb52c92e94301'
    project_id = 'notes-helper-383322'
    location = 'us'
    name = client.processor_path(project_id, location, processor_id)
    print("Google Document AI client initialized with processor path.")

    # Check if the event contains the necessary S3 information
    if 'Records' not in event or not event['Records']:
        print("No records found in the event.")
        raise ValueError("No records found in the event")
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    print(f"Processing S3 bucket: {bucket_name}, Key: {key}")

    # Get the document from S3
    response = s3_client.get_object(Bucket=bucket_name, Key=key)
    document_content = response['Body'].read()
    print("Document retrieved from S3.")

    # Retrieve the Content-Type from the metadata
    mime_type = response['ContentType']
    print(f"Retrieved Content-Type: {mime_type}")

    # Prepare the request to Document AI
    # Encode the document content in base64 if it's an image
    if mime_type.startswith('image/'):
        document_content = base64.b64encode(document_content).decode('utf-8')
    document = {"content": document_content, "mime_type": mime_type}
    request = {"name": name, "raw_document": document}
    print("Request prepared for Google Document AI.")

    # Process the document using Document AI
    result = client.process_document(request=request)
    document_text = result.document.text
    print("Document processed by Google Document AI.")

    # Output the results to a different S3 bucket
    output_bucket_name = 'spellbook-imagestore-ocr-results'
    output_key = f'processed/{key}'
    s3_client.put_object(Bucket=output_bucket_name, Key=output_key, Body=document_text.encode('utf-8'))
    print(f"Processed document text saved to S3 bucket: {output_bucket_name}, Key: {output_key}")

    return {
        'statusCode': 200,
        'body': json.dumps('Document processed successfully and saved to S3')
    }