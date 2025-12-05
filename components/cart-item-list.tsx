/**
 * @file cart-item-list.tsx
 * @description 장바구니 아이템 목록 컴포넌트
 *
 * 장바구니 아이템을 표시하고 수량 변경/삭제 기능을 제공
 */

"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/actions/cart";
import type { CartItemWithProduct } from "@/types/cart";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItemListProps {
  items: CartItemWithProduct[];
}

export function CartItemList({ items: initialItems }: CartItemListProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) return;

    setUpdatingIds((prev) => new Set(prev).add(cartItemId));
    startTransition(async () => {
      const result = await updateCartItemQuantity(cartItemId, newQuantity);
      if (result.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
        router.refresh();
      } else {
        toast.error(result.error || "수량 변경에 실패했습니다.");
      }
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    });
  };

  const handleRemove = async (cartItemId: string) => {
    setUpdatingIds((prev) => new Set(prev).add(cartItemId));
    startTransition(async () => {
      const result = await removeFromCart(cartItemId);
      if (result.success) {
        setItems((prev) => prev.filter((item) => item.id !== cartItemId));
        router.refresh();
        toast.success("장바구니에서 삭제되었습니다.");
      } else {
        toast.error(result.error || "삭제에 실패했습니다.");
      }
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isUpdating = updatingIds.has(item.id);
        const itemTotal = item.product.price * item.quantity;
        const isOutOfStock = item.product.stock_quantity === 0;

        return (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* 상품 정보 */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    단가: {formatPrice(item.product.price)}
                  </p>
                  {isOutOfStock && (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                      재고 부족
                    </p>
                  )}
                  {!isOutOfStock && item.quantity > item.product.stock_quantity && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                      재고: {item.product.stock_quantity}개 (수량 조정 필요)
                    </p>
                  )}
                </div>

                {/* 수량 조절 및 삭제 */}
                <div className="flex flex-col items-end gap-2">
                  {/* 수량 조절 */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isUpdating || item.quantity <= 1}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={
                        isUpdating ||
                        item.quantity >= item.product.stock_quantity
                      }
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 합계 */}
                  <p className="text-lg font-bold">
                    {formatPrice(itemTotal)}
                  </p>

                  {/* 삭제 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    disabled={isUpdating}
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

