/**
 * @file checkout-content.tsx
 * @description 주문 콘텐츠 컴포넌트
 *
 * 장바구니 확인 및 배송지 정보 입력 폼
 */

import { getCartSummary } from "@/actions/cart";
import { CheckoutForm } from "@/components/checkout-form";
import { CartSummary } from "@/components/cart-summary";
import { redirect } from "next/navigation";

export async function CheckoutContent() {
  const cartSummary = await getCartSummary();

  if (cartSummary.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 주문 폼 */}
      <div className="lg:col-span-2">
        <CheckoutForm />
      </div>

      {/* 장바구니 요약 */}
      <div className="lg:col-span-1">
        <CartSummary summary={cartSummary} />
      </div>
    </div>
  );
}

