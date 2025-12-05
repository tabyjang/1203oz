import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * Supabase 공식 모범 사례를 따르며 Clerk 통합을 지원합니다:
 * - @supabase/ssr 패키지 사용 (Cookie-based 세션 관리)
 * - JWT 템플릿 불필요 (Clerk 네이티브 통합)
 * - Clerk 토큰을 Supabase가 자동 검증
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
/**
 * 공개 데이터용 Supabase 클라이언트 (Server Component용)
 *
 * 인증이 필요 없는 공개 데이터 조회용입니다.
 * - @supabase/ssr 패키지 사용 (Cookie-based 세션 관리)
 * - accessToken 옵션 없이 사용 (인증 불필요)
 * - RLS 정책이 `to anon`인 데이터만 접근 가능
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createPublicSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function PublicPage() {
 *   const supabase = await createPublicSupabaseClient();
 *   const { data } = await supabase.from('products').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createPublicSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    // accessToken 옵션 없음 - 공개 데이터용
  });
}

export async function createClerkSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    // Clerk 통합: accessToken을 통해 Clerk 세션 토큰 전달
    async accessToken() {
      return (await auth()).getToken() ?? null;
    },
  });
}
