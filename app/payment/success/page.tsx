/**
 * @file app/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * Toss Payments 결제 성공 후 콜백 처리 및 주문 상태 업데이트
 */

import { Suspense } from "react";
import { PaymentSuccessContent } from "@/components/payment-success-content";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ orderId?: string; paymentKey?: string; amount?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          }
        >
          <PaymentSuccessContent
            orderId={params.orderId}
            paymentKey={params.paymentKey}
            amount={params.amount}
          />
        </Suspense>
      </div>
    </div>
  );
}

