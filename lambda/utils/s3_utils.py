import boto3

s3_client = boto3.client('s3')

def get_s3_object(bucket_name: str, key: str) -> bytes:
    """
    Fetches an object from S3 and returns its content as bytes.
    Handles potential UnicodeDecodeError by attempting to decode with 'utf-8' and 'latin-1' for text content.
    """
    response = s3_client.get_object(Bucket=bucket_name, Key=key)
    body = response['Body'].read()
    return body

def get_s3_object_as_text(bucket_name: str, key: str) -> str:
    """
    Fetches an object from S3 and returns its content as a string.
    Handles potential UnicodeDecodeError by attempting to decode with 'utf-8' and 'latin-1'.
    """
    body = get_s3_object(bucket_name, key)
    try:
        return body.decode('utf-8')
    except UnicodeDecodeError:
        return body.decode('latin-1')

def put_s3_object(bucket_name: str, key: str, content: str) -> None:
    """
    Puts an object into S3.
    """
    s3_client.put_object(Bucket=bucket_name, Key=key, Body=content.encode('utf-8'), ContentType='application/json')

def head_s3_object(bucket_name: str, key: str) -> dict:
    """
    Retrieves metadata from an object in S3.
    """
    response = s3_client.head_object(Bucket=bucket_name, Key=key)
    return response