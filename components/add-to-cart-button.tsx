/**
 * @file add-to-cart-button.tsx
 * @description 장바구니 추가 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 추가 버튼
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    startTransition(async () => {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        toast.success("장바구니에 추가되었습니다!");
        router.refresh();
      } else {
        toast.error(result.error || "장바구니 추가에 실패했습니다.");
      }
    });
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full"
        disabled={isOutOfStock || isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            추가 중...
          </>
        ) : isOutOfStock ? (
          <>
            <Package className="w-5 h-5 mr-2" />
            품절
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            장바구니에 추가
          </>
        )}
      </Button>
    </>
  );
}

