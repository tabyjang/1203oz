/**
 * @file lib/validations/order.ts
 * @description 주문 관련 Zod 스키마
 *
 * 주문 생성 및 업데이트 시 사용하는 검증 스키마
 */

import { z } from "zod";

/**
 * 배송지 주소 검증 스키마
 */
export const shippingAddressSchema = z.object({
  name: z.string().min(1, "수령인 이름을 입력해주세요").max(50, "이름은 50자 이하여야 합니다"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 연락처 형식이 아닙니다")
    .max(20, "연락처는 20자 이하여야 합니다"),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 우편번호 형식이 아닙니다")
    .max(10, "우편번호는 10자 이하여야 합니다"),
  address: z
    .string()
    .min(1, "주소를 입력해주세요")
    .max(200, "주소는 200자 이하여야 합니다"),
  addressDetail: z.string().max(200, "상세 주소는 200자 이하여야 합니다").optional(),
});

/**
 * 주문 생성 요청 검증 스키마
 */
export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  orderNote: z.string().max(500, "주문 메모는 500자 이하여야 합니다").optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

