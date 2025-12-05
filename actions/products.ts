/**
 * @file products.ts
 * @description 상품 관련 Server Actions
 *
 * 상품 조회, 필터링, 정렬 등의 서버 사이드 로직
 */

"use server";

import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { Product, ProductListParams, ProductListResponse } from "@/types/product";

const PRODUCTS_PER_PAGE = 12;

/**
 * 상품 목록 조회
 * @param params 조회 파라미터
 * @returns 상품 목록 및 페이지네이션 정보
 */
export async function getProducts(
  params: ProductListParams = {}
): Promise<ProductListResponse> {
  try {
    const supabase = await createPublicSupabaseClient();
    const {
      page = 1,
      category,
      sort = "latest",
      search,
      limit = PRODUCTS_PER_PAGE,
    } = params;

    // 기본 쿼리: 활성 상품만 조회
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // 카테고리 필터
    if (category) {
      query = query.eq("category", category);
    }

    // 검색 필터
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // 정렬
    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      case "latest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("상품을 불러오는 중 오류가 발생했습니다.");
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      products: (data as Product[]) || [],
      total,
      page,
      totalPages,
      limit,
    };
  } catch (error) {
    console.error("getProducts error:", error);
    throw error;
  }
}

/**
 * 상품 상세 조회
 * @param id 상품 ID
 * @returns 상품 정보 또는 null
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 상품을 찾을 수 없음
        return null;
      }
      console.error("Error fetching product:", error);
      throw new Error("상품을 불러오는 중 오류가 발생했습니다.");
    }

    return data as Product;
  } catch (error) {
    console.error("getProductById error:", error);
    throw error;
  }
}

/**
 * 인기 상품 조회 (홈페이지용)
 * @param limit 조회할 상품 수
 * @returns 상품 목록
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = await createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured products:", error);
      throw new Error("인기 상품을 불러오는 중 오류가 발생했습니다.");
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    throw error;
  }
}

/**
 * 카테고리별 상품 수 조회
 * @returns 카테고리별 상품 수
 */
export async function getProductCountsByCategory(): Promise<
  Record<string, number>
> {
  try {
    const supabase = await createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching product counts:", error);
      return {};
    }

    const counts: Record<string, number> = {};
    data?.forEach((item) => {
      const category = item.category || "uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error("getProductCountsByCategory error:", error);
    return {};
  }
}

