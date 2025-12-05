/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지
 *
 * 배송지 정보 입력 및 주문을 생성하는 페이지
 */

import { Suspense } from "react";
import { CheckoutContent } from "@/components/checkout-content";
import { CheckoutSkeleton } from "@/components/checkout-skeleton";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">주문하기</h1>
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}

