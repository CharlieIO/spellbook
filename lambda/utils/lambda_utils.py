import boto3
import json

lambda_client = boto3.client('lambda')

def invoke_lambda(function_name, payload):
    response = lambda_client.invoke(
        FunctionName=function_name,
        InvocationType='RequestResponse',  # Synchronous invocation
        Payload=json.dumps(payload)
    )
    return json.loads(response['Payload'].read().decode('utf-8'))
