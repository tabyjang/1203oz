/**
 * @file payment-page-content.tsx
 * @description 결제 페이지 콘텐츠 컴포넌트
 *
 * 주문 정보와 결제 위젯을 표시하는 컴포넌트
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentWidget } from "@/components/payment-widget";
import { formatPrice } from "@/lib/utils/format";
import type { OrderWithItems } from "@/types/order";
import { Package } from "lucide-react";

interface PaymentPageContentProps {
  order: OrderWithItems;
  customerKey: string;
}

export function PaymentPageContent({
  order,
  customerKey,
}: PaymentPageContentProps) {
  // Toss Payments는 주문 ID를 문자열로 요구하므로 UUID를 그대로 사용
  // 단, 특수문자가 포함될 수 있으므로 안전하게 처리
  const paymentOrderId = `order-${order.id}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 주문 정보 */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              주문 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">주문번호</p>
              <p className="font-semibold">{order.id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">주문 상품</p>
              <div className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}개
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">총 결제금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 결제 위젯 */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>결제 수단 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentWidget
              orderId={paymentOrderId}
              amount={order.total_amount}
              customerKey={customerKey}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

