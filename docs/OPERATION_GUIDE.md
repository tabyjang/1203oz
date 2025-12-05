# 운영 가이드

이 문서는 쇼핑몰 MVP 운영을 위한 가이드입니다.

## 📋 목차

1. [상품 관리](#상품-관리)
2. [주문 관리](#주문-관리)
3. [사용자 관리](#사용자-관리)
4. [결제 관리](#결제-관리)
5. [모니터링](#모니터링)
6. [문제 해결](#문제-해결)

## 🛍️ 상품 관리

### 상품 등록

1. Supabase Dashboard 접속
2. **Table Editor** → `products` 테이블 선택
3. **Insert row** 클릭
4. 다음 정보 입력:
   - `name`: 상품명 (필수)
   - `description`: 상품 설명 (선택)
   - `price`: 가격 (필수, 숫자)
   - `category`: 카테고리 코드 (선택)
   - `stock_quantity`: 재고 수량 (필수, 숫자)
   - `is_active`: 판매 활성화 여부 (true/false)

### 상품 수정

1. `products` 테이블에서 수정할 상품 선택
2. 필드 수정
3. **Save** 클릭

### 상품 삭제

1. `products` 테이블에서 삭제할 상품 선택
2. **Delete row** 클릭
3. 확인

> **⚠️ 주의**: 상품 삭제 시 해당 상품이 장바구니에서도 자동으로 삭제됩니다.

### 카테고리 코드

- `clothing`: 의류
- `electronics`: 전자제품
- `books`: 도서
- `food`: 식품
- `sports`: 스포츠
- `beauty`: 뷰티
- `home`: 생활/가정

## 📦 주문 관리

### 주문 상태

- `pending`: 주문 대기 (결제 전)
- `confirmed`: 주문 확인 (결제 완료)
- `shipped`: 배송 중
- `delivered`: 배송 완료
- `cancelled`: 주문 취소

### 주문 상태 변경

1. Supabase Dashboard → `orders` 테이블
2. 주문 선택
3. `status` 필드 수정
4. **Save** 클릭

### 주문 조회

- **전체 주문**: `orders` 테이블에서 조회
- **사용자별 주문**: `clerk_id`로 필터링
- **상태별 주문**: `status`로 필터링

### 주문 상세

- `order_items` 테이블에서 `order_id`로 조회
- 주문에 포함된 상품 목록 확인

## 👥 사용자 관리

### 사용자 조회

1. Supabase Dashboard → `users` 테이블
2. `clerk_id`로 Clerk 사용자와 매핑 확인

### 사용자 정보

- `clerk_id`: Clerk 사용자 ID (고유 식별자)
- `name`: 사용자 이름
- `created_at`: 가입일시

> **참고**: 사용자 인증은 Clerk에서 관리되며, Supabase에는 추가 정보만 저장됩니다.

## 💳 결제 관리

### 결제 모드

- **테스트 모드**: `test_ck_`로 시작하는 클라이언트 키 사용
- **프로덕션 모드**: `live_ck_`로 시작하는 클라이언트 키 사용

### 결제 상태 확인

1. Toss Payments 개발자센터 접속
2. **결제 내역** 메뉴에서 확인
3. 주문 ID로 검색 가능

### 결제 실패 처리

- 결제 실패 시 주문 상태는 `pending`으로 유지
- 사용자는 결제 페이지에서 다시 시도 가능
- 주문은 24시간 후 자동 삭제 권장 (별도 구현 필요)

## 📊 모니터링

### 주요 지표

1. **주문 수**: `orders` 테이블의 `created_at` 기준 집계
2. **매출**: `orders.total_amount` 합계
3. **인기 상품**: `order_items`에서 `product_id`별 집계
4. **재고 부족 상품**: `products`에서 `stock_quantity < 10` 필터

### 로그 확인

- **Vercel**: Dashboard → **Functions** → **Logs**
- **Supabase**: Dashboard → **Logs**
- **Clerk**: Dashboard → **Activity**

## 🔧 문제 해결

### 일반적인 문제

#### 1. 상품이 표시되지 않음

- `is_active`가 `true`인지 확인
- `stock_quantity`가 0보다 큰지 확인

#### 2. 주문이 생성되지 않음

- 장바구니에 아이템이 있는지 확인
- 재고가 충분한지 확인
- 로그에서 에러 메시지 확인

#### 3. 결제가 실패함

- Toss Payments 클라이언트 키 확인
- 네트워크 연결 확인
- Toss Payments 개발자센터에서 결제 내역 확인

#### 4. 사용자 인증 오류

- Clerk 환경 변수 확인
- Clerk Dashboard에서 사용자 상태 확인
- Supabase `users` 테이블 동기화 확인

### 데이터 백업

#### 수동 백업

1. Supabase Dashboard → **Database** → **Backups**
2. **Create backup** 클릭
3. 백업 파일 다운로드

#### 자동 백업

- Supabase Pro 플랜 이상에서 자동 백업 제공
- 일일 백업 권장

### 데이터 복원

1. Supabase Dashboard → **Database** → **Backups**
2. 복원할 백업 선택
3. **Restore** 클릭

## 📝 운영 체크리스트

### 일일 점검

- [ ] 주문 확인 및 처리
- [ ] 재고 부족 상품 확인
- [ ] 에러 로그 확인

### 주간 점검

- [ ] 매출 집계
- [ ] 인기 상품 분석
- [ ] 사용자 피드백 확인

### 월간 점검

- [ ] 데이터 백업
- [ ] 성능 최적화
- [ ] 보안 업데이트

## 🔐 보안

### 환경 변수 관리

- 프로덕션 환경 변수는 Vercel Dashboard에서 관리
- 절대 코드에 하드코딩하지 않음
- 정기적으로 키 로테이션

### 접근 권한

- Supabase `service_role` 키는 서버 사이드에서만 사용
- 클라이언트에서는 `anon` 키만 사용
- RLS 정책으로 데이터 접근 제어 (프로덕션)

## 📞 지원

### 기술 지원

- **문서**: [README.md](../README.md)
- **배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **테스트 체크리스트**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

### 서비스 지원

- **Clerk**: [support@clerk.com](mailto:support@clerk.com)
- **Supabase**: [Supabase Support](https://supabase.com/support)
- **Toss Payments**: [Toss Payments 고객센터](https://developers.tosspayments.com/support)

