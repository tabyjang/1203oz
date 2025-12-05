/**
 * @file category-grid.tsx
 * @description 카테고리 그리드 컴포넌트
 *
 * 홈페이지에서 카테고리별 진입 링크를 제공하는 그리드 컴포넌트
 */

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_LIST } from "@/constants/categories";
import {
  LuShirt,
  LuLaptop,
  LuBook,
  LuUtensils,
  LuDumbbell,
  LuSparkles,
  LuHome,
  LuPackage,
} from "lucide-react";

// 카테고리별 아이콘 매핑
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  clothing: LuShirt,
  electronics: LuLaptop,
  books: LuBook,
  food: LuUtensils,
  sports: LuDumbbell,
  beauty: LuSparkles,
  home: LuHome,
};

interface CategoryGridProps {
  categoryCounts?: Record<string, number>;
}

export function CategoryGrid({ categoryCounts }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {CATEGORY_LIST.map((category) => {
        const Icon = CATEGORY_ICONS[category.code] || LuPackage;
        const count = categoryCounts?.[category.code] || 0;

        return (
          <Link key={category.code} href={`/products?category=${category.code}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Icon className="w-12 h-12 mb-3 text-primary" />
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                {count > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {count}개 상품
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

