/**
 * @file order-list-content.tsx
 * @description 주문 내역 목록 콘텐츠 컴포넌트
 *
 * 사용자의 주문 내역을 표시하는 컴포넌트
 */

import { getOrders } from "@/actions/orders";
import { OrderList } from "@/components/order-list";
import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function OrderListContent() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">주문 내역이 없습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          첫 주문을 시작해보세요
        </p>
        <Link href="/products">
          <Button size="lg">
            <Package className="w-4 h-4 mr-2" />
            상품 둘러보기
          </Button>
        </Link>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}

