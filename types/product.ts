/**
 * @file product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블과 매핑되는 타입 정의
 */

/**
 * 상품 타입
 * Supabase products 테이블의 구조를 반영
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 목록 조회 파라미터
 */
export interface ProductListParams {
  page?: number;
  category?: string;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'name_asc';
  search?: string;
  limit?: number;
}

/**
 * 상품 목록 응답
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * 정렬 옵션 타입
 */
export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'name_asc';

/**
 * 정렬 옵션 라벨
 */
export const SORT_OPTIONS: Record<SortOption, string> = {
  latest: '최신순',
  price_asc: '가격 낮은순',
  price_desc: '가격 높은순',
  name_asc: '이름순',
};

