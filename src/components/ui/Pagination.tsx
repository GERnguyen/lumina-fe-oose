import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex h-12 min-w-12 items-center justify-center rounded-full px-3 text-sm font-medium transition",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-neutral-800 hover:bg-primary-50 hover:text-primary-500",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {page.toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
