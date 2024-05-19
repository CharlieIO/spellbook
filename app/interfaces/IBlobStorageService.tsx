export interface IBlobStorageService {
    generateSignedUrl(fileKey: string): Promise<string>;
    getSignedUrlForDisplay(fileKey: string): Promise<string>;
    getTextFromFile(fileKey: string): Promise<string>;
    deleteFile(fileKey: string): Promise<void>;
    getGeneratedQuiz(fileKey: string): Promise<string | null>;
}
