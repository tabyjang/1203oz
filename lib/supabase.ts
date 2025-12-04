/**
 * @deprecated 이 파일은 레거시입니다.
 * 
 * 대신 다음을 사용하세요:
 * - Server Component: `createClerkSupabaseClient` from '@/lib/supabase/server'
 * - Client Component: `useClerkSupabaseClient` from '@/lib/supabase/clerk-client'
 * - 공개 데이터: `createClient` from '@/lib/supabase/client'
 * 
 * 이 파일은 하위 호환성을 위해 유지되지만, 새 코드에서는 사용하지 마세요.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

/**
 * @deprecated Use `createClerkSupabaseClient` from '@/lib/supabase/server' instead
 */
export async function createSupabaseClient() {
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
        }
      },
    },
    async accessToken() {
      return (await auth()).getToken() ?? null;
    },
  });
}
