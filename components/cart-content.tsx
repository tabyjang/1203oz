/**
 * @file cart-content.tsx
 * @description 장바구니 콘텐츠 컴포넌트
 *
 * 장바구니 아이템 목록과 합계를 표시하는 컴포넌트
 */

import { getCartSummary } from "@/actions/cart";
import { CartItemList } from "@/components/cart-item-list";
import { CartSummary } from "@/components/cart-summary";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export async function CartContent() {
  const cartSummary = await getCartSummary();

  if (cartSummary.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">장바구니가 비어있습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          상품을 추가해보세요
        </p>
        <Link href="/products">
          <Button size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            상품 둘러보기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 장바구니 아이템 목록 */}
      <div className="lg:col-span-2">
        <CartItemList items={cartSummary.items} />
      </div>

      {/* 장바구니 요약 */}
      <div className="lg:col-span-1">
        <CartSummary summary={cartSummary} />
      </div>
    </div>
  );
}

