# 배포 가이드

이 문서는 Vercel을 사용한 프로덕션 배포 방법을 설명합니다.

## 📋 사전 준비

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속하여 계정 생성
2. GitHub 계정과 연동 (권장)

### 2. 필수 서비스 계정 준비

- **Clerk**: 인증 서비스 계정
- **Supabase**: 데이터베이스 서비스 계정
- **Toss Payments**: 결제 서비스 계정 (테스트 모드)

## 🚀 배포 단계

### 1. GitHub 저장소 연결

1. Vercel Dashboard → **Add New Project**
2. GitHub 저장소 선택 또는 Import
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 감지)
   - **Output Directory**: `.next` (자동 감지)
   - **Install Command**: `pnpm install` (자동 감지)

### 2. 환경 변수 설정

Vercel Dashboard → **Settings** → **Environment Variables**에서 다음 변수들을 추가:

#### Clerk 환경 변수

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

#### Supabase 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

#### Toss Payments 환경 변수 (테스트 모드)

```
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_xxxxxxxxxxxxx
```

> **⚠️ 중요**: 
> - 프로덕션 환경에서는 `live_ck_`로 시작하는 키를 사용해야 합니다
> - 테스트 모드에서는 `test_ck_`로 시작하는 키를 사용합니다

### 3. 배포 실행

1. **Deploy** 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 후 제공되는 URL로 접속하여 테스트

### 4. 커스텀 도메인 설정 (선택사항)

1. Vercel Dashboard → **Settings** → **Domains**
2. 도메인 추가 및 DNS 설정
3. SSL 인증서 자동 발급 (Let's Encrypt)

## 🔧 배포 후 확인 사항

### 필수 체크리스트

- [ ] 홈페이지 정상 로드
- [ ] 로그인/회원가입 기능 작동
- [ ] 상품 목록 페이지 정상 표시
- [ ] 장바구니 기능 작동
- [ ] 주문 생성 기능 작동
- [ ] 결제 위젯 정상 로드 (Toss Payments)
- [ ] 주문 내역 조회 기능 작동

### 환경별 설정

#### 프로덕션 환경

- Clerk: 프로덕션 키 사용
- Supabase: 프로덕션 프로젝트 사용
- Toss Payments: **라이브 키 사용** (`live_ck_`)

#### 테스트 환경

- Clerk: 테스트 키 사용
- Supabase: 개발 프로젝트 또는 별도 테스트 프로젝트
- Toss Payments: 테스트 키 사용 (`test_ck_`)

## 🐛 문제 해결

### 빌드 실패

1. **의존성 오류**: `package.json` 확인
2. **타입 오류**: TypeScript 컴파일 오류 확인
3. **환경 변수 누락**: 모든 필수 환경 변수 설정 확인

### 런타임 오류

1. **환경 변수 확인**: Vercel Dashboard에서 환경 변수 재확인
2. **서비스 연결 확인**: Clerk, Supabase, Toss Payments 서비스 상태 확인
3. **로그 확인**: Vercel Dashboard → **Functions** → **Logs**에서 에러 로그 확인

### 성능 최적화

1. **이미지 최적화**: Next.js Image 컴포넌트 사용
2. **캐싱 설정**: Vercel의 자동 캐싱 활용
3. **CDN 활용**: Vercel의 글로벌 CDN 자동 적용

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Clerk 배포 가이드](https://clerk.com/docs/deployments/overview)
- [Supabase 배포 가이드](https://supabase.com/docs/guides/getting-started/overview)

