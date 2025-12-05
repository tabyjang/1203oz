/**
 * @file cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * Navbar에 표시되는 장바구니 아이콘과 아이템 개수 배지
 */

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount } from "@/actions/cart";
import { Button } from "@/components/ui/button";

export async function CartIcon() {
  const count = await getCartItemCount();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Button>
    </Link>
  );
}

