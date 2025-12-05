/**
 * @file product-detail.tsx
 * @description 상품 상세 컴포넌트
 *
 * 상품의 상세 정보를 표시하는 컴포넌트
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, getStockStatus } from "@/lib/utils/format";
import { getCategoryName } from "@/constants/categories";
import type { Product } from "@/types/product";
import { Package, ShoppingCart, AlertCircle } from "lucide-react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const stockStatus = getStockStatus(product.stock_quantity);
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 상품 이미지 영역 */}
      <div className="w-full">
        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="text-center p-8">
            <Package className="w-32 h-32 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {product.name}
            </p>
          </div>
          {/* 재고 부족 배지 */}
          {isOutOfStock && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              품절
            </div>
          )}
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="space-y-2">
              {/* 카테고리 */}
              {product.category && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCategoryName(product.category)}
                </p>
              )}
              {/* 상품명 */}
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 가격 */}
            <div>
              <p className="text-4xl font-bold text-primary mb-2">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* 재고 정보 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    stockStatus.variant === "destructive"
                      ? "text-red-600 dark:text-red-400"
                      : stockStatus.variant === "warning"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {stockStatus.text}
                </span>
                {!isOutOfStock && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    (재고: {product.stock_quantity.toLocaleString("ko-KR")}개)
                  </span>
                )}
              </div>

              {/* 재고 부족 경고 */}
              {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    재고가 부족합니다. 빠른 구매를 권장합니다.
                  </p>
                </div>
              )}

              {/* 품절 안내 */}
              {isOutOfStock && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    현재 품절된 상품입니다. 재입고 알림을 받으시려면 관심 상품으로 등록해주세요.
                  </p>
                </div>
              )}
            </div>

            {/* 상품 설명 */}
            {product.description && (
              <div className="pt-4 border-t">
                <h2 className="text-lg font-semibold mb-2">상품 설명</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* 장바구니 추가 버튼 (Phase 3에서 기능 구현) */}
            <div className="pt-4 border-t">
              <Button
                size="lg"
                className="w-full"
                disabled={isOutOfStock}
                onClick={() => {
                  // Phase 3에서 장바구니 추가 기능 구현
                  console.log("장바구니 추가 (Phase 3에서 구현 예정)");
                }}
              >
                {isOutOfStock ? (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    품절
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    장바구니에 추가
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                * 장바구니 기능은 Phase 3에서 구현됩니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

