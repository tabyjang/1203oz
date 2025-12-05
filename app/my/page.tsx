/**
 * @file app/my/page.tsx
 * @description 마이페이지
 *
 * 사용자의 주문 내역을 조회하는 페이지
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OrderListContent } from "@/components/order-list-content";
import { OrderListSkeleton } from "@/components/order-list-skeleton";

export default async function MyPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrderListContent />
        </Suspense>
      </div>
    </div>
  );
}

