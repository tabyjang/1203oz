/**
 * @file app/payment/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * Toss Payments 결제 실패 후 안내
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface PaymentFailPageProps {
  searchParams: Promise<{ orderId?: string; message?: string; code?: string }>;
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-6 h-6" />
              결제 실패
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              결제 처리 중 오류가 발생했습니다.
            </p>
            {params.message && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">
                  {params.message}
                </p>
                {params.code && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    오류 코드: {params.code}
                  </p>
                )}
              </div>
            )}
            {params.orderId && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                주문번호:{" "}
                {params.orderId.startsWith("order-")
                  ? params.orderId.replace("order-", "")
                  : params.orderId}
              </p>
            )}
            <div className="flex gap-4 pt-4">
              <Link href="/checkout">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  다시 시도
                </Button>
              </Link>
              <Link href="/cart">
                <Button>장바구니로 이동</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

