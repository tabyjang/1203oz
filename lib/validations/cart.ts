/**
 * @file lib/validations/cart.ts
 * @description 장바구니 관련 Zod 스키마
 *
 * 장바구니 작업 시 사용하는 검증 스키마
 */

import { z } from "zod";

/**
 * 장바구니 추가 요청 검증 스키마
 */
export const addToCartSchema = z.object({
  productId: z.string().uuid("올바른 상품 ID 형식이 아닙니다"),
  quantity: z
    .number()
    .int("수량은 정수여야 합니다")
    .min(1, "수량은 1개 이상이어야 합니다")
    .max(999, "수량은 999개 이하여야 합니다"),
});

/**
 * 장바구니 수량 변경 요청 검증 스키마
 */
export const updateCartQuantitySchema = z.object({
  cartItemId: z.string().uuid("올바른 장바구니 아이템 ID 형식이 아닙니다"),
  quantity: z
    .number()
    .int("수량은 정수여야 합니다")
    .min(1, "수량은 1개 이상이어야 합니다")
    .max(999, "수량은 999개 이하여야 합니다"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;

