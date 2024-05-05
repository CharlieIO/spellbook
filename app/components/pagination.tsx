import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type CustomPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  
  export const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
  }) => {
    return (
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          )}
        </PaginationContent>
      </Pagination>
    );
  };
