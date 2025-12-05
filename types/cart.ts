/**
 * @file cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블과 매핑되는 타입 정의
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 타입
 * Supabase cart_items 테이블의 구조를 반영
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 장바구니 아이템 (상품 정보 포함)
 * cart_items와 products를 조인한 결과
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니 요약 정보
 */
export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  items: CartItemWithProduct[];
}

