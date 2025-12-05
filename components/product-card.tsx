/**
 * @file product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 * 홈페이지, 상품 목록 페이지에서 사용
 */

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatPrice, getStockStatus } from "@/lib/utils/format";
import { getCategoryName } from "@/constants/categories";
import type { Product } from "@/types/product";
import { LuPackage, LuShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export function ProductCard({ product, showCategory = false }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock_quantity);
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        {/* 상품 이미지 영역 (플레이스홀더) */}
        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          <div className="text-center p-4">
            <LuPackage className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.name}
            </p>
          </div>
          {/* 재고 부족 배지 */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              품절
            </div>
          )}
        </div>

        <CardHeader className="flex-1">
          <div className="space-y-2">
            {/* 카테고리 (선택사항) */}
            {showCategory && product.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getCategoryName(product.category)}
              </p>
            )}
            {/* 상품명 */}
            <h3 className="font-semibold text-lg line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
            {/* 상품 설명 (간략) */}
            {product.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {/* 가격 */}
            <p className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {/* 재고 상태 */}
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  stockStatus.variant === "destructive"
                    ? "text-red-600 dark:text-red-400"
                    : stockStatus.variant === "warning"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
                }
              >
                {stockStatus.text}
              </span>
              {!isOutOfStock && (
                <span className="text-gray-500 dark:text-gray-400">
                  (재고: {product.stock_quantity}개)
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            variant={isOutOfStock ? "outline" : "default"}
            disabled={isOutOfStock}
            onClick={(e) => {
              // Phase 3에서 장바구니 추가 기능 구현
              // 현재는 상세 페이지로 이동만
              e.preventDefault();
            }}
          >
            {isOutOfStock ? (
              "품절"
            ) : (
              <>
                <LuShoppingCart className="w-4 h-4" />
                상세보기
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

