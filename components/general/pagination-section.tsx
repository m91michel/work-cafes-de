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
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationSectionProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
}

export function PaginationSection({
  totalItems,
  pageSize,
  currentPage,
}: PaginationSectionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / pageSize);

  // Create page URL with current search params
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate pagination range
  const generatePaginationRange = () => {
    const range = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    
    if (showEllipsisStart) {
      range.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
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
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
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
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 