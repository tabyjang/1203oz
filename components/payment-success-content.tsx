/**
 * @file payment-success-content.tsx
 * @description 결제 성공 콘텐츠 컴포넌트
 *
 * 결제 성공 후 주문 상태 업데이트 및 안내
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { updateOrderStatus } from "@/actions/orders";
import { toast } from "sonner";
import Link from "next/link";

interface PaymentSuccessContentProps {
  orderId?: string;
  paymentKey?: string;
  amount?: string;
}

export function PaymentSuccessContent({
  orderId,
  paymentKey,
  amount,
}: PaymentSuccessContentProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      if (!orderId) {
        setError("주문 정보가 없습니다.");
        setIsProcessing(false);
        return;
      }

      try {
        // orderId에서 "order-" 접두사 제거 (실제 주문 ID 추출)
        const actualOrderId = orderId.startsWith("order-")
          ? orderId.replace("order-", "")
          : orderId;

        // 주문 상태를 "confirmed"로 업데이트
        const result = await updateOrderStatus(actualOrderId, "confirmed");

        if (result.success) {
          setIsSuccess(true);
          toast.success("결제가 완료되었습니다!");
        } else {
          setError(result.error || "주문 상태 업데이트에 실패했습니다.");
          toast.error(result.error || "주문 상태 업데이트에 실패했습니다.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [orderId]);

  if (isProcessing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span>결제를 처리하는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            처리 실패
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <div className="flex gap-4">
            <Link href="/orders">
              <Button>주문 내역으로 이동</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">쇼핑 계속하기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            결제 완료
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            결제가 성공적으로 완료되었습니다.
          </p>
          {orderId && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                주문번호: {orderId}
              </p>
              {amount && (
                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                  결제 금액: {parseInt(amount).toLocaleString("ko-KR")}원
                </p>
              )}
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Link
              href={`/orders/${
                orderId.startsWith("order-")
                  ? orderId.replace("order-", "")
                  : orderId
              }`}
            >
              <Button>주문 상세 보기</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">쇼핑 계속하기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

