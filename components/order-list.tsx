/**
 * @file order-list.tsx
 * @description 주문 내역 목록 컴포넌트
 *
 * 주문 목록을 카드 형태로 표시하는 컴포넌트
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/order";
import { Package, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderListProps {
  orders: Order[];
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "주문 대기",
  confirmed: "주문 확인",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};

const ORDER_STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  confirmed: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-lg">
                    주문번호: {order.id.slice(0, 8)}...
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  ORDER_STATUS_VARIANTS[order.status] || "outline"
                }
              >
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  결제 금액
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline">
                  상세 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

