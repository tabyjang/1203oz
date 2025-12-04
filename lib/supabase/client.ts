import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase 브라우저 클라이언트 (Client Component용)
 *
 * Supabase 공식 모범 사례를 따릅니다:
 * - @supabase/ssr 패키지의 createBrowserClient 사용
 * - 브라우저에서 실행되는 Client Component에서 사용
 * - 인증이 필요 없는 공개 데이터 접근용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { createClient } from '@/lib/supabase/client';
 *
 * export default function PublicData() {
 *   const supabase = createClient();
 *   // 공개 데이터 조회
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
