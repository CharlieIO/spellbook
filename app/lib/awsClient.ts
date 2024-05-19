import { S3 } from '@aws-sdk/client-s3';
import { SQS } from '@aws-sdk/client-sqs';

// Ensure environment variables are defined
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error("AWS configuration environment variables are missing");
}

const s3Client = new S3({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});

const sqsClient = new SQS({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});

export { s3Client, sqsClient };
