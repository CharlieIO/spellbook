import { S3BlobStorageService } from './S3BlobStorageService';
import { s3Client } from '../lib/awsClient';
import { IBlobStorageService } from '@/interfaces/IBlobStorageService'; // Corrected import statement
import SupabaseDatastoreAccessService from './SupabaseDatastoreAccessService';
import { IDatastoreAccessService } from '@/interfaces/IDatastoreAccessService';
import { GroqLlmService } from './GroqLlmService';
import { ILlmService } from '@/interfaces/ILlmService';
import { OpenAiLlmService } from './OpenAiLlmService';

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

/**
 * Provides an instance of the SupabaseDatastoreAccessService which implements the IDatastoreAccessService interface.
 * This function abstracts the creation and configuration of the SupabaseDatastoreAccessService,
 * allowing other parts of the application to use Supabase datastore services without knowing the details of the Supabase implementation.
 * 
 * @returns {IDatastoreAccessService} An instance of a class that implements the IDatastoreAccessService interface.
 */
function provideDatastoreService(): IDatastoreAccessService {
  return new SupabaseDatastoreAccessService();
}

/**
 * Provides an instance of the GroqLlmService which implements the ILlmService interface.
 * This function abstracts the creation and configuration of the GroqLlmService,
 * allowing other parts of the application to use Groq's language model services without knowing the details of the Groq implementation.
 * 
 * @returns {ILlmService} An instance of a class that implements the ILlmService interface.
 */
function provideLargeLlmService(): ILlmService {
  return new OpenAiLlmService();
}

/**
 * Provides an instance of the GroqLlmService which implements the ILlmService interface.
 * This function abstracts the creation and configuration of the GroqLlmService,
 * allowing other parts of the application to use Groq's language model services without knowing the details of the Groq implementation.
 * This particular service is configured to use a lightweight, faster model suitable for small and less complex requests.
 * 
 * @returns {ILlmService} An instance of a class that implements the ILlmService interface.
 */
function provideSmallLlmService(): ILlmService {
  return new GroqLlmService();
}




export { provideBlobStorageService, provideDatastoreService, provideLargeLlmService, provideSmallLlmService };
