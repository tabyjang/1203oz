/**
 * @file app/checkout/payment/page.tsx
 * @description 결제 페이지
 *
 * 주문 생성 후 결제를 진행하는 페이지
 */

import { Suspense } from "react";
import { PaymentPageContent } from "@/components/payment-page-content";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/actions/orders";

interface PaymentPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect("/checkout");
  }

  // 주문 정보 조회
  const order = await getOrderById(orderId);

  if (!order) {
    redirect("/checkout");
  }

  // 이미 결제 완료된 주문인 경우
  if (order.status !== "pending") {
    redirect(`/orders/${orderId}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">결제하기</h1>
        <Suspense
          fallback={
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          }
        >
          <PaymentPageContent order={order} customerKey={userId} />
        </Suspense>
      </div>
    </div>
  );
}

