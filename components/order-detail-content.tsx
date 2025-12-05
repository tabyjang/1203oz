/**
 * @file order-detail-content.tsx
 * @description 주문 상세 콘텐츠 컴포넌트
 *
 * 주문 정보와 주문 아이템을 표시하는 컴포넌트
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import type { OrderWithItems } from "@/types/order";
import { CheckCircle2, Package, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderDetailContentProps {
  order: OrderWithItems;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "주문 대기",
  confirmed: "주문 확인",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const shippingAddress = order.shipping_address;

  return (
    <div className="space-y-6">
      {/* 주문 상태에 따른 메시지 */}
      {order.status === "confirmed" && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                  주문이 완료되었습니다!
                </h2>
                <p className="text-green-700 dark:text-green-300 mt-1">
                  주문번호: {order.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주문 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              주문 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문 상태</span>
              <span className="font-semibold">
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문일시</span>
              <span>
                {new Date(order.created_at).toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>총 결제금액</span>
              <span className="text-primary">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 배송지 정보 */}
        {shippingAddress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                배송지 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">수령인</span>
                <p className="font-semibold">{shippingAddress.name}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">연락처</span>
                <p className="font-semibold">{shippingAddress.phone}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">주소</span>
                <p className="font-semibold">
                  [{shippingAddress.postalCode}] {shippingAddress.address}
                  {shippingAddress.addressDetail && ` ${shippingAddress.addressDetail}`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 주문 메모 */}
      {order.order_note && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              주문 메모
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {order.order_note}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 주문 상품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-4 border-b last:border-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPrice(item.price)} × {item.quantity}개
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t text-lg font-bold">
              <span>총 결제금액</span>
              <span className="text-primary">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex gap-4">
        <Link href="/products" className="flex-1">
          <Button variant="outline" className="w-full">
            쇼핑 계속하기
          </Button>
        </Link>
        <Link href="/my" className="flex-1">
          <Button className="w-full">주문 내역 보기</Button>
        </Link>
      </div>
    </div>
  );
}

