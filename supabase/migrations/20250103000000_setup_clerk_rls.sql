-- Clerk + Supabase 네이티브 통합을 위한 RLS 정책 설정
-- 2025년 4월 이후 권장 방식: Clerk를 third-party auth provider로 설정

-- ============================================
-- 1. Users 테이블에 RLS 정책 추가
-- ============================================

-- Users 테이블에 RLS 활성화 (개발 중이지만 예제로 포함)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users 테이블의 RLS 정책 (주석 처리 - 개발 중에는 비활성화)
-- 인증된 사용자는 자신의 레코드만 조회 가능
/*
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = clerk_id
);

-- 인증된 사용자는 자신의 프로필만 업데이트 가능
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = clerk_id
)
WITH CHECK (
  (SELECT auth.jwt()->>'sub') = clerk_id
);
*/

-- ============================================
-- 2. 예제 Tasks 테이블 생성 (Clerk 문서 예제)
-- ============================================

-- Tasks 테이블 생성
-- user_id는 Clerk user ID를 저장 (TEXT 타입)
-- 주의: DEFAULT 절에서는 서브쿼리를 사용할 수 없으므로, 
-- INSERT 시 애플리케이션에서 user_id를 명시적으로 설정하거나
-- 트리거를 사용하여 자동으로 설정해야 합니다.
CREATE TABLE IF NOT EXISTS public.tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- RLS 비활성화 (개발 단계)
-- 프로덕션에서는 아래 주석을 해제하고 RLS를 활성화하세요
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- RLS 정책 (프로덕션용 - 주석 처리)
/*
-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "User can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = user_id)
);

-- 사용자는 자신의 tasks만 생성 가능
CREATE POLICY "Users must insert their own tasks"
ON public.tasks
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = user_id)
);

-- 사용자는 자신의 tasks만 업데이트 가능
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

-- 사용자는 자신의 tasks만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = user_id)
);
*/

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;

-- 시퀀스 권한 부여 (SERIAL 타입 사용 시 필요)
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO service_role;

-- ============================================
-- 3. 인덱스 생성 (성능 최적화)
-- ============================================

-- user_id로 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

-- ============================================
-- 4. 업데이트 시간 자동 갱신 함수 (선택사항)
-- ============================================

-- updated_at 컬럼을 자동으로 갱신하는 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- tasks 테이블에 트리거 추가
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

