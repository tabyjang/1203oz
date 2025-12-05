/**
 * @file cart-content.tsx
 * @description 장바구니 콘텐츠 컴포넌트
 *
 * 장바구니 아이템 목록과 합계를 표시하는 컴포넌트
 */

import { getCartSummary } from "@/actions/cart";
import { CartItemList } from "@/components/cart-item-list";
import { CartSummary } from "@/components/cart-summary";
import { EmptyState } from "@/components/empty-state";
import { ShoppingBag } from "lucide-react";

export async function CartContent() {
  const cartSummary = await getCartSummary();

  if (cartSummary.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="장바구니가 비어있습니다"
        description="상품을 추가하여 쇼핑을 시작해보세요"
        action={{
          label: "상품 둘러보기",
          href: "/products",
        }}
      />
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

