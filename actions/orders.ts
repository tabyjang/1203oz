/**
 * @file orders.ts
 * @description 주문 관련 Server Actions
 *
 * 주문 생성 및 조회를 처리하는 서버 사이드 로직
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import type {
  CreateOrderRequest,
  Order,
  OrderItem,
  OrderWithItems,
  ShippingAddress,
} from "@/types/order";
import { getCartItems } from "./cart";

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
 * 주문 생성
 * @param request 주문 생성 요청 데이터
 */
export async function createOrder(
  request: CreateOrderRequest
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    // 장바구니 아이템 조회
    const cartItems = await getCartItems();

    if (cartItems.length === 0) {
      return { success: false, error: "장바구니가 비어있습니다." };
    }

    // 재고 확인 및 합계 계산
    let totalAmount = 0;
    const orderItemsData: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      price: number;
    }> = [];

    for (const cartItem of cartItems) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity, is_active")
        .eq("id", cartItem.product_id)
        .single();

      if (productError || !product) {
        return {
          success: false,
          error: `상품을 찾을 수 없습니다: ${cartItem.product.name}`,
        };
      }

      if (!product.is_active) {
        return {
          success: false,
          error: `판매 중인 상품이 아닙니다: ${product.name}`,
        };
      }

      if (product.stock_quantity < cartItem.quantity) {
        return {
          success: false,
          error: `재고가 부족합니다: ${product.name} (현재 재고: ${product.stock_quantity}개)`,
        };
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: product.id,
        product_name: product.name,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    // 주문 생성
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: clerkId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: request.shippingAddress as any,
        order_note: request.orderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return { success: false, error: "주문 생성에 실패했습니다." };
    }

    // 주문 상세 아이템 생성
    const orderItemsInsert = orderItemsData.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsInsert);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      // 주문은 생성되었지만 아이템 생성 실패 시 주문 삭제
      await supabase.from("orders").delete().eq("id", order.id);
      return { success: false, error: "주문 아이템 생성에 실패했습니다." };
    }

    // 재고 차감
    for (const cartItem of cartItems) {
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", cartItem.product_id)
        .single();

      if (product) {
        const newStock = product.stock_quantity - cartItem.quantity;
        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", cartItem.product_id);
      }
    }

    // 장바구니 비우기
    await supabase.from("cart_items").delete().eq("clerk_id", clerkId);

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("createOrder error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 목록 조회
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error("getOrders error:", error);
    return [];
  }
}

/**
 * 주문 상세 조회 (아이템 포함)
 * @param orderId 주문 ID
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = await createClerkSupabaseClient();

    // 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return null;
    }

    // 주문 아이템 조회
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return null;
    }

    return {
      ...(order as Order),
      items: (items || []) as OrderItem[],
    };
  } catch (error) {
    console.error("getOrderById error:", error);
    return null;
  }
}

