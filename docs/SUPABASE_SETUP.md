# Supabase 설정 가이드

이 문서는 Supabase 공식 모범 사례를 기반으로 Next.js 프로젝트에 Supabase를 연결하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [패키지 설치](#패키지-설치)
3. [환경 변수 설정](#환경-변수-설정)
4. [클라이언트 설정](#클라이언트-설정)
5. [사용 방법](#사용-방법)
6. [참고 자료](#참고-자료)

## 개요

이 프로젝트는 Supabase 공식 권장 방식인 `@supabase/ssr` 패키지를 사용합니다:

- ✅ **Cookie-based 세션 관리**: 서버와 클라이언트 간 세션 동기화
- ✅ **Next.js App Router 최적화**: Server/Client Component 지원
- ✅ **Clerk 통합**: Clerk 세션 토큰을 Supabase에 전달
- ✅ **타입 안전성**: TypeScript 완전 지원

## 패키지 설치

필요한 패키지는 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.8",
    "@supabase/ssr": "^0.8.0"
  }
}
```

새 프로젝트를 시작하는 경우:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

## 환경 변수 설정

`.env` 파일에 다음 변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**참고**:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 Supabase 공식 문서의 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`와 동일합니다
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용하며, 절대 클라이언트에 노출하지 마세요

## 클라이언트 설정

프로젝트에는 환경별 Supabase 클라이언트가 준비되어 있습니다:

### 1. Server Component용 (`lib/supabase/server.ts`)

```typescript
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClerkSupabaseClient();
  // ...
}
```

**특징**:

- `@supabase/ssr`의 `createServerClient` 사용
- Cookie 기반 세션 관리
- Clerk 세션 토큰 자동 전달

### 2. Client Component용 (`lib/supabase/clerk-client.ts`)

```typescript
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  // ...
}
```

**특징**:

- `@supabase/ssr`의 `createBrowserClient` 사용
- React Hook으로 제공
- Clerk 세션 토큰 자동 전달

### 3. 공개 데이터용 (`lib/supabase/client.ts`)

```typescript
import { createClient } from "@/lib/supabase/client";

export default function PublicData() {
  const supabase = createClient();
  // 인증 불필요한 공개 데이터 접근
}
```

**특징**:

- 인증 없이 공개 데이터 접근
- RLS 정책이 `to anon`인 데이터만 접근 가능

### 4. 관리자 권한용 (`lib/supabase/service-role.ts`)

```typescript
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export async function adminFunction() {
  const supabase = getServiceRoleClient();
  // RLS 우회, 모든 데이터 접근 가능
}
```

**특징**:

- RLS 정책 우회
- 서버 사이드에서만 사용
- 관리자 작업에 사용

## 사용 방법

### Server Component 예제

```tsx
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function TasksPage() {
  const supabase = await createClerkSupabaseClient();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Client Component 예제

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useEffect, useState } from "react";

export default function TasksPage() {
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
    }

    loadTasks();
  }, [supabase]);

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action 예제

```ts
"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";

export async function addTask(name: string) {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase.from("tasks").insert({ name });

  if (error) {
    throw new Error("Failed to add task");
  }

  return data;
}
```

## Supabase 공식 가이드와의 차이점

### 공식 가이드

Supabase 공식 문서는 Supabase Auth를 사용하는 경우를 다룹니다:

```typescript
// 공식 가이드 (Supabase Auth 사용)
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  // Supabase Auth 세션 사용
}
```

### 이 프로젝트 (Clerk 통합)

이 프로젝트는 Clerk를 인증 제공자로 사용하므로, Clerk 세션 토큰을 Supabase에 전달합니다:

```typescript
// 이 프로젝트 (Clerk 통합)
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClerkSupabaseClient();
  // Clerk 세션 토큰이 자동으로 전달됨
}
```

**주요 차이점**:

- `accessToken` 옵션을 통해 Clerk 세션 토큰 전달
- Supabase Auth 대신 Clerk 인증 사용
- RLS 정책에서 `auth.jwt()->>'sub'`로 Clerk user ID 확인

## 참고 자료

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Clerk Supabase Integration](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [프로젝트 통합 가이드](./CLERK_SUPABASE_INTEGRATION.md)
