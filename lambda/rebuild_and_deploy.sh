#!/bin/bash

FUNCTION_NAME="notesOcrJob"
IMAGE_NAME="lambda-deploy-package"

echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

echo "Extracting function.zip..."
docker run --rm $IMAGE_NAME cat /app/function.zip > function.zip

echo "Updating Lambda function code..."
aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://function.zip

echo "Cleaning up..."
docker rmi $IMAGE_NAME

echo "Deployment complete."