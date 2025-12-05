/**
 * @file checkout-form.tsx
 * @description 주문 폼 컴포넌트
 *
 * 배송지 정보 및 주문 메모를 입력하는 폼
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ShippingAddress } from "@/types/order";

const checkoutSchema = z.object({
  name: z.string().min(1, "수령인 이름을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 연락처 형식이 아닙니다"),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요")
    .regex(/^[0-9-]+$/, "올바른 우편번호 형식이 아닙니다"),
  address: z.string().min(1, "주소를 입력해주세요"),
  addressDetail: z.string().optional(),
  orderNote: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      postalCode: "",
      address: "",
      addressDetail: "",
      orderNote: "",
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    startTransition(async () => {
      const shippingAddress: ShippingAddress = {
        name: values.name,
        phone: values.phone,
        postalCode: values.postalCode,
        address: values.address,
        addressDetail: values.addressDetail,
      };

      const result = await createOrder({
        shippingAddress,
        orderNote: values.orderNote,
      });

      if (result.success && result.orderId) {
        // 주문 생성 성공 시 결제 단계로 이동
        router.push(`/checkout/payment?orderId=${result.orderId}`);
      } else {
        toast.error(result.error || "주문 생성에 실패했습니다.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송지 정보</CardTitle>
        <CardDescription>
          주문하실 상품의 배송지 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수령인 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연락처</FormLabel>
                  <FormControl>
                    <Input placeholder="010-1234-5678" {...field} />
                  </FormControl>
                  <FormDescription>
                    하이픈(-)을 포함하여 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>우편번호</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주소</FormLabel>
                  <FormControl>
                    <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상세 주소 (선택)</FormLabel>
                  <FormControl>
                    <Input placeholder="101동 101호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주문 메모 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="배송 시 요청사항을 입력해주세요"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  주문 처리 중...
                </>
              ) : (
                "주문하기"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

