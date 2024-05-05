interface IBlobStorageService {
    generateSignedUrl(fileKey: string): Promise<string>;
    getSignedUrlForDisplay(fileKey: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
  export default IBlobStorageService;