import { useCallback } from 'react';

// Function to delete an image
async function deleteImage(imageKey: string) {
  const response = await fetch(`/api/class/notes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageKey })
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }

  console.log(`Image deleted successfully: ${imageKey}`);
}

// Hook to manage image deletion
export function useImageDeleter(refetchImages: () => void) {
  const handleDelete = useCallback(async (imageKey: string) => {
    try {
      await deleteImage(imageKey);
      refetchImages(); // Refresh images after deletion
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [refetchImages]);

  return handleDelete;
}