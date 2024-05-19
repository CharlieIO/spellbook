#!/bin/bash

deploy_lambda() {
  FUNCTION_NAME=$1
  IMAGE_NAME=$2
  DOCKERFILE_PATH=$3
  BUILD_CONTEXT=$4

  echo "Building the Docker image for $FUNCTION_NAME..."
  docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH $BUILD_CONTEXT

  echo "Extracting function.zip..."
  docker run --rm $IMAGE_NAME cat /app/function.zip > function.zip
  echo "Updating Lambda function code..."
  aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://function.zip

  echo "Cleaning up..."
  docker rmi $IMAGE_NAME
  rm function.zip
}

# deploy_lambda "notesOcrJob" "notes-ocr-job-image" "functions/notesOcrJob/Dockerfile" .
# deploy_lambda "quizGeneration" "quiz-generation-image" "functions/quizGeneration/Dockerfile" .
deploy_lambda "quizGenerationOrchestrator" "quiz-generation-orchestrator-image" "functions/quizGenerationOrchestrator/Dockerfile" .

echo "Deployment complete."