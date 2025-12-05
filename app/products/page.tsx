/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 필터링, 정렬, 페이지네이션이 포함된 상품 목록 페이지
 */

import { Suspense } from "react";
import { ProductList } from "@/components/product-list";
import { ProductFilters } from "@/components/product-filters";
import { getProducts } from "@/actions/products";
import type { ProductListParams } from "@/types/product";
import { ProductListSkeleton } from "@/components/product-list-skeleton";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // URL 파라미터를 ProductListParams로 변환
  const productParams: ProductListParams = {
    page: params.page ? parseInt(params.page, 10) : 1,
    category: params.category || undefined,
    sort: (params.sort as ProductListParams["sort"]) || "latest",
    search: params.search || undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">상품 목록</h1>
          <p className="text-gray-600 dark:text-gray-400">
            다양한 상품을 탐색하고 구매하세요
          </p>
        </div>

        {/* 필터 및 정렬 */}
        <div className="mb-6">
          <ProductFilters currentParams={productParams} />
        </div>

        {/* 상품 목록 */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListContent params={productParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductListContent({
  params,
}: {
  params: ProductListParams;
}) {
  const response = await getProducts(params);

  return (
    <ProductList
      products={response.products}
      total={response.total}
      currentPage={response.page}
      totalPages={response.totalPages}
      currentParams={params}
    />
  );
}

