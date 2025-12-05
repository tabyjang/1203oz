/**
 * @file order-list-content.tsx
 * @description 주문 내역 목록 콘텐츠 컴포넌트
 *
 * 사용자의 주문 내역을 표시하는 컴포넌트
 */

import { getOrders } from "@/actions/orders";
import { OrderList } from "@/components/order-list";
import { EmptyState } from "@/components/empty-state";
import { Package } from "lucide-react";

export async function OrderListContent() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="주문 내역이 없습니다"
        description="첫 주문을 시작해보세요"
        action={{
          label: "상품 둘러보기",
          href: "/products",
        }}
      />
    );
  }

  return <OrderList orders={orders} />;
}

