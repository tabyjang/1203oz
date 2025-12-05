/**
 * @file product-list.tsx
 * @description 상품 목록 컴포넌트
 *
 * 상품 목록을 그리드로 표시하고 페이지네이션을 포함
 */

import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import type { Product, ProductListParams } from "@/types/product";
import { PackageSearch } from "lucide-react";

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
    const getEmptyStateContent = () => {
      if (currentParams.search) {
        return {
          title: "검색 결과가 없습니다",
          description: `"${currentParams.search}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`,
        };
      }
      if (currentParams.category) {
        return {
          title: "해당 카테고리의 상품이 없습니다",
          description: "다른 카테고리를 선택하거나 전체 상품을 둘러보세요.",
        };
      }
      return {
        title: "등록된 상품이 없습니다",
        description: "현재 등록된 상품이 없습니다. 곧 새로운 상품이 추가될 예정입니다.",
      };
    };

    const content = getEmptyStateContent();

    return (
      <EmptyState
        icon={PackageSearch}
        title={content.title}
        description={content.description}
        action={
          currentParams.search || currentParams.category
            ? {
                label: "필터 초기화",
                href: "/products",
              }
            : undefined
        }
      />
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

