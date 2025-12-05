/**
 * @file cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니 총 금액과 주문하기 버튼을 표시
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import type { CartSummary as CartSummaryType } from "@/types/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">상품 수</span>
            <span>{summary.totalItems}개</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>총 금액</span>
            <span className="text-primary">{formatPrice(summary.totalAmount)}</span>
          </div>
        </div>

        <Link href="/checkout" className="block">
          <Button className="w-full" size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            주문하기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

