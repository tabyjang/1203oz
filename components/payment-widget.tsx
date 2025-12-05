/**
 * @file payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * Toss Payments 위젯을 초기화하고 결제를 처리하는 컴포넌트
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentWidgetProps {
  orderId: string;
  amount: number;
  customerKey: string; // Clerk user ID
}

export function PaymentWidget({ orderId, amount, customerKey }: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializePaymentWidget = async () => {
      try {
        // Toss Payments 위젯 초기화
        const paymentWidget = await loadPaymentWidget(
          process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!,
          customerKey
        );

        paymentWidgetRef.current = paymentWidget;

        // 결제 수단 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing payment widget:", error);
        toast.error("결제 위젯 초기화에 실패했습니다.");
        setIsLoading(false);
      }
    };

    if (process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY) {
      initializePaymentWidget();
    } else {
      console.error("TOSS_PAYMENTS_CLIENT_KEY is not set");
      toast.error("결제 설정이 올바르지 않습니다.");
      setIsLoading(false);
    }
  }, [customerKey, amount]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      toast.error("결제 위젯이 초기화되지 않았습니다.");
      return;
    }

    setIsProcessing(true);

    try {
      // 결제 요청
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: `주문 #${orderId.replace("order-", "").slice(0, 8)}`,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
        customerEmail: undefined, // 필요시 추가
        customerName: undefined, // 필요시 추가
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
      toast.error("결제 요청에 실패했습니다.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">결제 위젯을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 수단 위젯 */}
      <div id="payment-widget" className="min-h-[400px]" />

      {/* 결제 버튼 */}
      <Button
        onClick={handlePayment}
        className="w-full"
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            결제 처리 중...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            결제하기
          </>
        )}
      </Button>
    </div>
  );
}

