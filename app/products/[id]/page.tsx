/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 개별 상품의 상세 정보를 표시하는 페이지
 */

import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/actions/products";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuArrowLeft } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // 비활성 상품 접근 시 안내
  if (!product.is_active) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">판매 중지된 상품입니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            이 상품은 현재 판매 중지되었습니다.
          </p>
          <Link href="/products">
            <Button>상품 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 관련 상품 조회 (같은 카테고리의 다른 상품 4개)
  const relatedProducts = product.category
    ? await getProducts({
        category: product.category,
        limit: 5, // 5개 조회 후 현재 상품 제외
      })
    : { products: [] };

  const relatedProductsFiltered = relatedProducts.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <Link href="/products" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <LuArrowLeft className="w-4 h-4 mr-2" />
            상품 목록으로
          </Button>
        </Link>

        {/* 상품 상세 정보 */}
        <ProductDetail product={product} />

        {/* 관련 상품 */}
        {relatedProductsFiltered.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">관련 상품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsFiltered.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showCategory
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

