import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService';

export class S3BlobStorageService implements IBlobStorageService {
    private s3Client: S3Client;
    constructor(s3Client: S3Client) {
        this.s3Client = s3Client;
    }

    async generateSignedUrl(fileKey: string): Promise<string> {
        const bucketName = process.env.AWS_S3_IMAGESTORE_BUCKET_NAME;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        const urlExpiryTime = parseInt(process.env.S3_URL_EXPIRY_TIME || '60'); // Default to 60 seconds if not specified in the environment variable
        const uploadUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: urlExpiryTime
        });
        return uploadUrl;
    }

    /**
     * Generates a signed URL for displaying a blob from the S3 bucket.
     * 
     * @param fileKey The key of the file to retrieve in the S3 bucket for display purposes.
     * @returns A promise that resolves with the signed URL as a string.
     */
    async getSignedUrlForDisplay(fileKey: string): Promise<string> {
        const bucketName = process.env.AWS_S3_IMAGESTORE_BUCKET_NAME;

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        try {
            const urlExpiryTime = parseInt(process.env.S3_URL_EXPIRY_TIME || '3600'); // Default to 3600 seconds if not specified in the environment variable
            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: urlExpiryTime
            });
            return signedUrl;
        } catch (error) {
            console.error(`Failed to generate signed URL for file with key ${fileKey} from bucket ${bucketName}:`, error);
            throw new Error(`Failed to generate signed URL for file with key ${fileKey} from bucket ${bucketName}`);
        }
    }

    /**
     * Retrieves text content from a file in the S3 bucket.
     * 
     * @param fileKey The key of the file to retrieve text from in the S3 bucket.
     * @returns A promise that resolves with the text content of the file.
     */
    async getTextFromFile(fileKey: string): Promise<string> {
        const bucketName = process.env.AWS_S3_IMAGESTORE_OCR_BUCKET_NAME;

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: "processed/" + fileKey,
        });

        try {
            const { Body } = await this.s3Client.send(command);
            const text = await this.streamToBuffer(Body as Readable);
            return text.toString('utf-8');
        } catch (error) {
            console.error(`Failed to retrieve text from file with key ${fileKey} from bucket ${bucketName}:`, error);
            throw new Error(`Failed to retrieve text from file with key ${fileKey} from bucket ${bucketName}`);
        }
    }

    /**
     * Deletes a file from the S3 bucket.
     * 
     * @param fileKey The key of the file to delete in the S3 bucket.
     * @returns A promise that resolves when the file has been successfully deleted.
     */
    async deleteFile(fileKey: string): Promise<void> {
        const bucketName = process.env.AWS_S3_IMAGESTORE_BUCKET_NAME;

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        try {
            await this.s3Client.send(command);
            console.log(`File with key ${fileKey} deleted successfully from bucket ${bucketName}.`);
        } catch (error) {
            console.error(`Failed to delete file with key ${fileKey} from bucket ${bucketName}:`, error);
            throw new Error(`Failed to delete file with key ${fileKey} from bucket ${bucketName}`);
        }
    }

    /**
     * Retrieves generated quiz content from a file in the S3 bucket.
     * 
     * @param fileKey The key of the file to retrieve the generated quiz from in the S3 bucket.
     * @returns A promise that resolves with the generated quiz content of the file.
     */
    async getGeneratedQuiz(fileKey: string): Promise<string | null> {
        const bucketName = process.env.AWS_S3_QUIZ_BUCKET_NAME;

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: "quizzes/" + fileKey + ".json",
        });


        try {
            const { Body } = await this.s3Client.send(command);
            const quizContent = await this.streamToBuffer(Body as Readable);
            const quizText = quizContent.toString('utf-8');
            return quizText;
        } catch (error) {
            if (error instanceof Error && error.name === 'NoSuchKey') {
                console.error(`NoSuchKey: The specified key does not exist. Key: quizzes/${fileKey}`);
                return null;
            }
            console.error(`Failed to retrieve generated quiz from file with key ${fileKey} from bucket ${bucketName}:`, error);
            throw new Error(`Failed to retrieve generated quiz from file with key ${fileKey} from bucket ${bucketName}`);
        }
    }

    /**
     * Helper function to convert a readable stream to a Buffer.
     * 
     * @param stream The readable stream to convert.
     * @returns A promise that resolves with the Buffer.
     */
    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
    }
}