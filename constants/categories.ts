/**
 * @file categories.ts
 * @description 카테고리 상수 정의
 *
 * 상품 카테고리 코드와 한글명 매핑
 */

/**
 * 카테고리 코드와 한글명 매핑
 */
export const CATEGORIES: Record<string, string> = {
  clothing: '의류',
  electronics: '전자제품',
  books: '도서',
  food: '식품',
  sports: '스포츠',
  beauty: '뷰티',
  home: '생활/가정',
};

/**
 * 카테고리 한글명 가져오기
 * @param categoryCode 카테고리 코드
 * @returns 한글명 또는 원본 코드
 */
export function getCategoryName(categoryCode: string | null): string {
  if (!categoryCode) return '미분류';
  return CATEGORIES[categoryCode] || categoryCode;
}

/**
 * 모든 카테고리 목록 (코드, 한글명 쌍)
 */
export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([code, name]) => ({
  code,
  name,
}));

