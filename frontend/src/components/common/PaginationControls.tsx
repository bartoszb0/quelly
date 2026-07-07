import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const pages = Array.from(
    { length: Math.min(3, totalPages - currentPage + 1) },
    (_, index) => currentPage + index,
  );

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : undefined
            }
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={() => {
                onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
