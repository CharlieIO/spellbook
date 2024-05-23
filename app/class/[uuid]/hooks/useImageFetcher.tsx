import { useState, useEffect, useCallback } from 'react';

export function useImageFetcher(classUuid: string, currentPage: number, imagesPerPage: number) {
  const [images, setImages] = useState<{url: string, key: string}[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    const cacheKey = `images-${classUuid}-${currentPage}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { images, totalPages } = JSON.parse(cachedData);
      setImages(images);
      setTotalPages(totalPages);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/class/notes?classUuid=${classUuid}&page=${currentPage}&limit=${imagesPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      const formattedImages = data.images.map((img: {url: string, key: string}) => ({
        url: img.url,
        key: img.key
      }));
      setImages(formattedImages);
      setTotalPages(data.totalPages);
      localStorage.setItem(cacheKey, JSON.stringify({ images: formattedImages, totalPages: data.totalPages }));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classUuid, currentPage, imagesPerPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, totalPages, isLoading, refetchImages: fetchImages };
}
