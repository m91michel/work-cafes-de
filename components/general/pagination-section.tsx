"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState, parseAsString } from "next-usequerystate";

interface PaginationSectionProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  visiblePages?: number; // Number of pages to show around current page
}

export function PaginationSection({
  totalItems,
  pageSize,
  currentPage,
  visiblePages = 2, // Default to showing 2 pages on each side
}: PaginationSectionProps) {
  const [, setPage] = useQueryState(
    "page",
    parseAsString.withOptions({ scroll: true, shallow: false })
  );
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = async (pageNumber: number) => {
    await setPage(pageNumber.toString());
  };

  // Generate pagination range
  const generatePaginationRange = () => {
    const range = [];
    const showEllipsisStart = currentPage > visiblePages + 2;
    const showEllipsisEnd = currentPage < totalPages - (visiblePages + 1);

    if (totalPages <= (visiblePages * 2) + 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);

    if (showEllipsisStart) {
      range.push("...");
    }

    for (
      let i = Math.max(2, currentPage - visiblePages);
      i <= Math.min(totalPages - 1, currentPage + visiblePages);
      i++
    ) {
      range.push(i);
    }

    if (showEllipsisEnd) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = generatePaginationRange();

  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            aria-disabled={currentPage <= 1}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {paginationRange.map((page, index) => {
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page as number);
                }}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
