# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 네이티브 통합하는 방법을 설명합니다. 2025년 4월 이후 권장되는 방식입니다.

## 📋 목차

1. [개요](#개요)
2. [설정 단계](#설정-단계)
3. [코드 구현](#코드-구현)
4. [RLS 정책 설정](#rls-정책-설정)
5. [테스트](#테스트)

## 개요

### 통합 방식

이 프로젝트는 **Clerk의 네이티브 Supabase 통합**을 사용합니다:

- ✅ **JWT 템플릿 불필요**: Clerk 세션 토큰을 직접 사용
- ✅ **보안 향상**: Supabase JWT secret을 Clerk와 공유할 필요 없음
- ✅ **성능 향상**: 매 요청마다 새 JWT 생성 불필요
- ✅ **간편한 설정**: Clerk Dashboard에서 한 번만 설정

### 아키텍처

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│ Client  │ ──────> │  Clerk   │ ──────> │ Supabase │
│ (Next.js)│         │  Auth    │         │ Database │
└─────────┘         └──────────┘         └──────────┘
     │                    │                     │
     │                    │                     │
     └────────────────────┴─────────────────────┘
              Clerk Session Token
```

1. 사용자가 Clerk로 로그인
2. Clerk가 세션 토큰 발급
3. Supabase 클라이언트가 Clerk 세션 토큰을 사용하여 데이터베이스 접근
4. RLS 정책이 `auth.jwt()->>'sub'`로 사용자 식별

## 설정 단계

### 1. Clerk Dashboard 설정

1. [Clerk Dashboard](https://dashboard.clerk.com)에 로그인
2. **Integrations** > **Supabase**로 이동
3. **Activate Supabase integration** 클릭
4. **Clerk domain** 복사 (예: `your-app.clerk.accounts.dev`)

### 2. Supabase Dashboard 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Authentication** > **Sign In / Up** > **Third Party Auth**로 이동
4. **Add provider** 클릭
5. **Clerk** 선택
6. Clerk Dashboard에서 복사한 **Clerk domain** 붙여넣기
7. **Save** 클릭

### 3. 환경 변수 설정

`.env` 파일에 다음 변수들이 설정되어 있는지 확인:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 코드 구현

### Client Component에서 사용

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export default function TasksPage() {
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
    }

    loadTasks();
  }, [supabase]);

  async function createTask(name: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name });

    if (!error) {
      // 성공
      window.location.reload();
    }
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Component에서 사용

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function TasksPage() {
  // ⚠️ 중요: createClerkSupabaseClient는 async 함수이므로 await 필요
  const supabase = await createClerkSupabaseClient();

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```ts
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';

export async function addTask(name: string) {
  // ⚠️ 중요: createClerkSupabaseClient는 async 함수이므로 await 필요
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error('Failed to add task');
  }

  return data;
}
```

## RLS 정책 설정

### 기본 원칙

RLS (Row Level Security) 정책은 `auth.jwt()->>'sub'`를 사용하여 Clerk user ID를 가져옵니다.

### 예제: Tasks 테이블 RLS 정책

```sql
-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "User can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = user_id)
);

-- INSERT 정책: 사용자는 자신의 tasks만 생성 가능
CREATE POLICY "Users must insert their own tasks"
ON public.tasks
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = user_id)
);

-- UPDATE 정책: 사용자는 자신의 tasks만 업데이트 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = user_id)
)
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = user_id)
);

-- DELETE 정책: 사용자는 자신의 tasks만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = user_id)
);
```

### 주의사항

1. **개발 환경**: 개발 중에는 RLS를 비활성화할 수 있습니다:
   ```sql
   ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
   ```

2. **프로덕션 환경**: 프로덕션에서는 반드시 RLS를 활성화하고 적절한 정책을 설정하세요.

3. **성능 최적화**: `TO authenticated` 절을 사용하여 익명 사용자에 대한 정책 실행을 방지합니다.

## 테스트

### 1. 로그인 테스트

1. 애플리케이션 실행: `pnpm dev`
2. 로그인 페이지에서 Clerk로 로그인
3. 로그인 성공 확인

### 2. 데이터 접근 테스트

1. 로그인한 상태에서 tasks 페이지 접근
2. 새 task 생성
3. 생성한 task가 목록에 표시되는지 확인

### 3. 다중 사용자 테스트

1. 첫 번째 계정으로 로그인하여 task 생성
2. 로그아웃
3. 두 번째 계정으로 로그인
4. 첫 번째 계정의 task가 보이지 않는지 확인 (RLS 활성화 시)

### 4. RLS 정책 테스트

Supabase Dashboard의 SQL Editor에서:

```sql
-- 현재 인증된 사용자의 Clerk ID 확인
SELECT auth.jwt()->>'sub' as clerk_user_id;

-- 현재 사용자의 tasks 조회
SELECT * FROM tasks;
```

## 문제 해결

### 문제: "Row Level Security policy violation"

**원인**: RLS 정책이 활성화되어 있지만 적절한 정책이 없거나, 정책 조건이 맞지 않음

**해결**:
1. RLS 정책이 올바르게 설정되었는지 확인
2. `auth.jwt()->>'sub'`가 올바른 Clerk user ID를 반환하는지 확인
3. 개발 중이라면 RLS를 일시적으로 비활성화

### 문제: "Invalid token" 또는 "Unauthorized"

**원인**: Clerk 세션 토큰이 Supabase에 전달되지 않음

**해결**:
1. Clerk Dashboard에서 Supabase 통합이 활성화되었는지 확인
2. Supabase Dashboard에서 Clerk가 third-party provider로 추가되었는지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### 문제: 다른 사용자의 데이터가 보임

**원인**: RLS가 비활성화되어 있거나 정책이 올바르지 않음

**해결**:
1. RLS가 활성화되어 있는지 확인: `SELECT * FROM pg_tables WHERE tablename = 'tasks' AND rowsecurity = true;`
2. RLS 정책이 올바르게 설정되었는지 확인
3. 정책에서 `TO authenticated` 절이 포함되어 있는지 확인

## 참고 자료

- [Clerk Supabase 통합 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 가이드](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

## 마이그레이션 파일

RLS 정책이 포함된 마이그레이션 파일:
- `supabase/migrations/20250103000000_setup_clerk_rls.sql`

이 파일에는:
- Users 테이블 RLS 정책 (주석 처리)
- Tasks 예제 테이블 및 RLS 정책
- 인덱스 및 트리거 설정

## 다음 단계

1. 프로덕션 배포 전 RLS 정책 활성화
2. 추가 테이블에 대한 RLS 정책 작성
3. 복잡한 권한 로직이 필요한 경우 함수 기반 RLS 정책 고려

