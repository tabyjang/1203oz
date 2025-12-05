/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자가 장바구니에 담은 상품을 확인하고 관리하는 페이지
 */

import { Suspense } from "react";
import { CartContent } from "@/components/cart-content";
import { CartSkeleton } from "@/components/cart-skeleton";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>
        <Suspense fallback={<CartSkeleton />}>
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
}

