/**
 * @file app/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 *
 * 주문 완료 후 주문 상세 정보를 표시하는 페이지
 */

import { Suspense } from "react";
import { OrderDetailContent } from "@/components/order-detail-content";
import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/orders";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">주문 완료</h1>
        <Suspense fallback={<div>로딩 중...</div>}>
          <OrderDetailContent order={order} />
        </Suspense>
      </div>
    </div>
  );
}

