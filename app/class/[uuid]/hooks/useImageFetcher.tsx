import { useState, useEffect, useCallback } from 'react';

interface Image {
  url: string;
  key: string;
  data: string;
}

export function useImageFetcher(classUuid: string, currentPage: number, imagesPerPage: number) {
  const [images, setImages] = useState<Image[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the image URL has expired
  const isImageExpired = (url: string): boolean => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const expiresParam = urlParams.get('X-Amz-Expires');
    const dateParam = urlParams.get('X-Amz-Date');

    if (!expiresParam || !dateParam) {
      return true; // Missing parameters indicate expiration
    }

    // Construct the expiration date from the dateParam string by extracting and formatting the year, month, day, hour, minute, and second components.
    const expirationDate = new Date(
      `${dateParam.substring(0, 4)}-${dateParam.substring(4, 6)}-${dateParam.substring(6, 8)}T${dateParam.substring(9, 11)}:${dateParam.substring(11, 13)}:${dateParam.substring(13, 15)}Z`
    );
    const expirationTime = expirationDate.getTime() + parseInt(expiresParam) * 1000;
    return Date.now() > expirationTime;
  };

  // Fetch images from cache or API
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    const cacheKey = `images-${classUuid}-${currentPage}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { images, totalPages } = JSON.parse(cachedData);

      // Filter out expired images
      const validImages = (await Promise.all(images.map(async (image: Image) => {
        return (await isImageExpired(image.url)) ? null : image;
      }))).filter((image: Image | null) => image !== null) as Image[];

      if (validImages.length === images.length) {
        setImages(validImages);
        setTotalPages(totalPages);
        setIsLoading(false);
        return;
      }
    }

    // Fetch images from API if cache is invalid or missing
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
      const formattedImages: Image[] = data.images.map((img: Image) => ({
        url: img.url,
        key: img.key,
        data: img.data
      }));
      setImages(formattedImages);
      setTotalPages(data.totalPages);
      if (formattedImages.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ images: formattedImages, totalPages: data.totalPages }));
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classUuid, currentPage, imagesPerPage]);

  // Fetch images on component mount or when dependencies change
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, totalPages, isLoading, refetchImages: fetchImages };
}
