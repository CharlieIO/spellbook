import { S3BlobStorageService } from './S3BlobStorageService';
import { s3Client } from '../lib/awsClient';
import IBlobStorageService from '@/interfaces/IBlobStorageService';

/**
 * Provides an instance of the S3BlobStorageService which implements the IBlobStorageService interface.
 * This function abstracts the creation and configuration of the S3BlobStorageService,
 * allowing other parts of the application to use S3 storage without knowing the details of the S3 implementation.
 * 
 * @returns {IBlobStorageService} An instance of a class that implements the IBlobStorageService interface.
 */
function provideBlobStorageService(): IBlobStorageService {
  return new S3BlobStorageService(s3Client);
}

export { provideBlobStorageService };
