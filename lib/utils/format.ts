/**
 * @file format.ts
 * @description 포맷팅 유틸리티 함수
 *
 * 가격, 날짜 등의 데이터 포맷팅 함수
 */

/**
 * 가격을 원화 형식으로 포맷팅
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "89,000원")
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * 가격을 원화 형식으로 포맷팅 (원 단위 없이)
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "89,000")
 */
export function formatPriceNumber(price: number): string {
  return price.toLocaleString('ko-KR');
}

/**
 * 재고 상태 텍스트 반환
 * @param stockQuantity 재고 수량
 * @returns 재고 상태 텍스트
 */
export function getStockStatus(stockQuantity: number): {
  text: string;
  variant: 'default' | 'warning' | 'destructive';
} {
  if (stockQuantity === 0) {
    return { text: '품절', variant: 'destructive' };
  }
  if (stockQuantity < 10) {
    return { text: '재고 부족', variant: 'warning' };
  }
  return { text: '재고 있음', variant: 'default' };
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param dateString ISO 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: "2025년 1월 3일")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

