import { useState, useCallback } from 'react';

// Custom hook for pagination
function usePagination(initialPage: number = 1, totalPages: number = Infinity) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage => Math.max(1, currentPage - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1));
  }, [totalPages]);

  const setPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) {
      console.error(`Attempted to set page to ${page}, which is outside of the valid range (1 to ${totalPages}).`);
      return;
    }
    setCurrentPage(page);
  }, [totalPages]);

  return { currentPage, setCurrentPage: setPage, handlePreviousPage, handleNextPage };
}

export default usePagination;