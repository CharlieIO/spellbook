import { useCallback } from 'react';

// Function to fetch presigned URLs from the server
async function fetchPresignedUrls(fileNames: string[], classUuid: string) {
  const response = await fetch(`/api/class/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      classUuid: classUuid,
      numberOfFiles: fileNames.length
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch presigned URLs');
  }

  const jsonResponse = await response.json();
  if (!jsonResponse || !Array.isArray(jsonResponse)) {
    throw new Error('Invalid response structure');
  }

  return jsonResponse.map((file: { presignedUrl: string; fileKey: string; }) => ({
    presignedUrl: file.presignedUrl,
    fileKey: file.fileKey
  }));
}

// Function to upload files to the presigned URLs
async function uploadFilesToSignedUrls(files: FileList, presignedUrls: { presignedUrl: string; fileKey: string }[]) {
  await Promise.all(presignedUrls.map(async (presignedUrl, index) => {
    const file = files[index];
    const uploadResponse = await fetch(presignedUrl.presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${file.name}`);
    }

    console.log(`File uploaded successfully: ${presignedUrl.fileKey}`);
  }));
}

// Function to invalidate cache
function invalidateCache(classUuid: string) {
  const cacheKeyPrefix = `images-${classUuid}-`;
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(cacheKeyPrefix)) {
      localStorage.removeItem(key);
    }
  });
}

// Hook to manage file uploads
export function useFileUploader(classUuid: string) {
  const handleUpload = useCallback(async (files: FileList | null) => {
    if (files && classUuid) {
      const fileNames = Array.from(files).map(file => file.name);
      try {
        const presignedUrls = await fetchPresignedUrls(fileNames, classUuid);
        await uploadFilesToSignedUrls(files, presignedUrls);
        invalidateCache(classUuid);
        console.log('All files uploaded successfully');
      } catch (error) {
        console.error('Error during file upload:', error);
      }
    } else {
      console.error('No files to upload or class UUID is missing');
    }
  }, [classUuid]);

  return handleUpload;
}