/**
 * @file pagination.tsx
 * @description 페이지네이션 컴포넌트
 *
 * 상품 목록 페이지의 페이지네이션 UI
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductListParams } from "@/types/product";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentParams?: ProductListParams; // 향후 사용 예정
}

export function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변 페이지 표시
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 이전 페이지 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* 페이지 번호 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(pageNum)}
              className={isActive ? "pointer-events-none" : ""}
              aria-label={`${pageNum}페이지로 이동`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* 다음 페이지 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

