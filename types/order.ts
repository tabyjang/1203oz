/**
 * @file order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders, order_items 테이블과 매핑되는 타입 정의
 */

/**
 * 배송지 주소 타입
 */
export interface ShippingAddress {
  name: string; // 수령인 이름
  phone: string; // 연락처
  address: string; // 기본 주소
  addressDetail?: string; // 상세 주소
  postalCode: string; // 우편번호
}

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 주문 타입
 * Supabase orders 테이블의 구조를 반영
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상세 아이템 타입
 * Supabase order_items 테이블의 구조를 반영
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 (상세 아이템 포함)
 */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * 주문 생성 요청 데이터
 */
export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  orderNote?: string;
}

