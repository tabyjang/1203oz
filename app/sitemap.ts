/**
 * @file app/sitemap.ts
 * @description sitemap.xml 생성 파일
 *
 * 검색 엔진을 위한 사이트맵 생성
 */

import { MetadataRoute } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 동적 페이지: 활성 상품 목록
  try {
    const supabase = await createPublicSupabaseClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1000); // 최대 1000개 상품만 포함

    const productPages: MetadataRoute.Sitemap =
      products?.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}

