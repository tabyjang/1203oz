/**
 * @file product-list.tsx
 * @description 상품 목록 컴포넌트
 *
 * 상품 목록을 그리드로 표시하고 페이지네이션을 포함
 */

import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import type { Product, ProductListParams } from "@/types/product";
import { LuPackageSearch } from "lucide-react";

interface ProductListProps {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
  currentParams: ProductListParams;
}

export function ProductList({
  products,
  total,
  currentPage,
  totalPages,
  currentParams,
}: ProductListProps) {
  // 빈 상태
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LuPackageSearch className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">상품을 찾을 수 없습니다</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {currentParams.search
            ? `"${currentParams.search}"에 대한 검색 결과가 없습니다.`
            : currentParams.category
              ? "해당 카테고리의 상품이 없습니다."
              : "등록된 상품이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 상품 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showCategory />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          currentParams={currentParams}
        />
      )}

      {/* 결과 수 표시 */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        총 {total.toLocaleString("ko-KR")}개의 상품
        {currentParams.category && ` (${currentParams.category} 카테고리)`}
      </div>
    </div>
  );
}

