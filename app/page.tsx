/**
 * @file app/page.tsx
 * @description 홈 페이지
 *
 * 프로모션, 카테고리 그리드, 인기 상품을 표시하는 메인 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryGrid } from "@/components/category-grid";
import { getFeaturedProducts, getProductCountsByCategory } from "@/actions/products";
import { LuArrowRight, LuShoppingBag } from "lucide-react";

export default async function Home() {
  // 인기 상품 조회
  const featuredProducts = await getFeaturedProducts(8);
  
  // 카테고리별 상품 수 조회
  const categoryCounts = await getProductCountsByCategory();

  return (
    <main className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              의류 쇼핑몰에
              <br />
              오신 것을 환영합니다
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              다양한 상품을 만나보고 특별한 쇼핑 경험을 즐기세요
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8">
                  <LuShoppingBag className="w-5 h-5 mr-2" />
                  상품 둘러보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 프로모션 배너 */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">신규 회원 특가 이벤트</h2>
            <p className="text-lg opacity-90 mb-4">
              지금 가입하고 첫 구매 시 특별 할인을 받으세요
            </p>
            <Link href="/products">
              <Button variant="secondary" size="lg">
                이벤트 상품 보기
                <LuArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 그리드 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">카테고리별 둘러보기</h2>
            <p className="text-gray-600 dark:text-gray-400">
              원하는 카테고리를 선택하여 상품을 탐색하세요
            </p>
          </div>
          <CategoryGrid categoryCounts={categoryCounts} />
        </div>
      </section>

      {/* 인기 상품 */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">인기 상품</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  지금 가장 인기 있는 상품들을 만나보세요
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline">
                  전체 보기
                  <LuArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showCategory />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
