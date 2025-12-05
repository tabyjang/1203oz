/**
 * @file cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 장바구니 CRUD 작업을 처리하는 서버 사이드 로직
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  CartItem,
  CartItemWithProduct,
  CartSummary,
} from "@/types/cart";

/**
 * 현재 사용자의 Clerk ID 가져오기
 */
async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("인증이 필요합니다.");
  }
  return userId;
}

/**
 * 장바구니에 상품 추가
 * @param productId 상품 ID
 * @param quantity 수량 (기본값: 1)
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    // 상품 존재 및 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock_quantity, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품을 찾을 수 없습니다." };
    }

    if (!product.is_active) {
      return { success: false, error: "판매 중인 상품이 아닙니다." };
    }

    if (product.stock_quantity < quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 기존 장바구니 아이템 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("clerk_id", clerkId)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // 기존 아이템이 있으면 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        return {
          success: false,
          error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
        };
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return { success: false, error: "장바구니 업데이트에 실패했습니다." };
      }
    } else {
      // 새 아이템 추가
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          clerk_id: clerkId,
          product_id: productId,
          quantity,
        });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return { success: false, error: "장바구니 추가에 실패했습니다." };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("addToCart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 * @param cartItemId 장바구니 아이템 ID
 * @param quantity 새로운 수량
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (quantity <= 0) {
      return { success: false, error: "수량은 1개 이상이어야 합니다." };
    }

    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    // 장바구니 아이템 및 상품 정보 조회
    const { data: cartItem, error: cartError } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity")
      .eq("id", cartItemId)
      .eq("clerk_id", clerkId)
      .single();

    if (cartError || !cartItem) {
      return { success: false, error: "장바구니 아이템을 찾을 수 없습니다." };
    }

    // 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity, is_active")
      .eq("id", cartItem.product_id)
      .single();

    if (productError || !product) {
      return { success: false, error: "상품을 찾을 수 없습니다." };
    }

    if (!product.is_active) {
      return { success: false, error: "판매 중인 상품이 아닙니다." };
    }

    if (quantity > product.stock_quantity) {
      return {
        success: false,
        error: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 수량 업데이트
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId);

    if (updateError) {
      console.error("Error updating cart item quantity:", updateError);
      return { success: false, error: "수량 변경에 실패했습니다." };
    }

    return { success: true };
  } catch (error) {
    console.error("updateCartItemQuantity error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 * @param cartItemId 장바구니 아이템 ID
 */
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("clerk_id", clerkId);

    if (deleteError) {
      console.error("Error removing from cart:", deleteError);
      return { success: false, error: "장바구니에서 삭제에 실패했습니다." };
    }

    return { success: true };
  } catch (error) {
    console.error("removeFromCart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 전체 조회 (상품 정보 포함)
 */
export async function getCartItems(): Promise<CartItemWithProduct[]> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }

    // 타입 변환
    return (data || []).map((item: any) => ({
      ...item,
      product: item.product,
    })) as CartItemWithProduct[];
  } catch (error) {
    console.error("getCartItems error:", error);
    return [];
  }
}

/**
 * 장바구니 요약 정보 조회
 */
export async function getCartSummary(): Promise<CartSummary> {
  try {
    const items = await getCartItems();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalAmount,
      items,
    };
  } catch (error) {
    console.error("getCartSummary error:", error);
    return {
      totalItems: 0,
      totalAmount: 0,
      items: [],
    };
  }
}

/**
 * 장바구니 아이템 개수 조회 (빠른 조회용)
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error fetching cart item count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("getCartItemCount error:", error);
    return 0;
  }
}

