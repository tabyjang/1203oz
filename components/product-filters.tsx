/**
 * @file product-filters.tsx
 * @description 상품 필터 및 정렬 컴포넌트
 *
 * 카테고리 필터, 정렬 옵션, 검색 기능 제공
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LIST, getCategoryName } from "@/constants/categories";
import { SORT_OPTIONS, type SortOption } from "@/types/product";
import { LuSearch, LuX } from "lucide-react";
import { useState, useTransition } from "react";
import type { ProductListParams } from "@/types/product";

interface ProductFiltersProps {
  currentParams: ProductListParams;
}

export function ProductFilters({ currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    currentParams.search || ""
  );

  const updateParams = (updates: Partial<ProductListParams>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      // 페이지는 항상 1로 리셋 (필터 변경 시)
      if (updates.category !== undefined || updates.sort !== undefined) {
        params.set("page", "1");
      }

      // 업데이트 적용
      if (updates.category) {
        params.set("category", updates.category);
      } else if (updates.category === null) {
        params.delete("category");
      }

      if (updates.sort) {
        params.set("sort", updates.sort);
      } else if (updates.sort === null) {
        params.delete("sort");
      }

      if (updates.search) {
        params.set("search", updates.search);
      } else if (updates.search === null || updates.search === "") {
        params.delete("search");
      }

      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateParams({ search: searchValue || null });
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/products");
  };

  const hasActiveFilters =
    currentParams.category || currentParams.sort || currentParams.search;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="상품명으로 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
              disabled={isPending}
            />
          </div>
        </form>

        {/* 카테고리 필터 */}
        <Select
          value={currentParams.category || "all"}
          onValueChange={(value) =>
            updateParams({ category: value === "all" ? null : value })
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            {CATEGORY_LIST.map((category) => (
              <SelectItem key={category.code} value={category.code}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 정렬 */}
        <Select
          value={currentParams.sort || "latest"}
          onValueChange={(value) =>
            updateParams({ sort: value as SortOption })
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 필터 초기화 */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            <LuX className="w-4 h-4 mr-2" />
            초기화
          </Button>
        )}
      </div>

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm">
          {currentParams.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
              카테고리: {getCategoryName(currentParams.category)}
            </span>
          )}
          {currentParams.sort && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
              정렬: {SORT_OPTIONS[currentParams.sort]}
            </span>
          )}
          {currentParams.search && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
              검색: {currentParams.search}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

