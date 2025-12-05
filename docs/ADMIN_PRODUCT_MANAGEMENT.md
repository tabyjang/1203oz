# 어드민 상품 관리 가이드

이 문서는 Supabase Dashboard를 통해 상품을 등록하고 관리하는 방법을 설명합니다.

## 개요

MVP 단계에서는 별도의 어드민 페이지를 제공하지 않습니다. 대신 Supabase Dashboard의 Table Editor를 사용하여 상품을 직접 등록하고 관리합니다.

## 상품 등록 방법

### 1. Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **Table Editor** 클릭
4. `products` 테이블 선택

### 2. 새 상품 추가

1. **Insert row** 버튼 클릭
2. 다음 정보 입력:

   - **name** (필수): 상품명
   - **description** (선택): 상품 설명
   - **price** (필수): 가격 (숫자, 예: 25000)
   - **category** (선택): 카테고리 코드
     - `clothing` - 의류
     - `electronics` - 전자제품
     - `books` - 도서
     - `food` - 식품
     - `sports` - 스포츠
     - `beauty` - 뷰티
     - `home` - 생활/가정
   - **stock_quantity** (필수): 재고 수량 (숫자, 예: 100)
   - **is_active** (필수): 판매 활성화 여부 (true/false)
     - `true`: 상품 목록에 표시됨
     - `false`: 상품 목록에서 숨김

3. **Save** 클릭

### 3. 상품 수정

1. `products` 테이블에서 수정할 상품 행 클릭
2. 수정할 필드 변경
3. **Save** 클릭

### 4. 상품 삭제

1. `products` 테이블에서 삭제할 상품 행 클릭
2. **Delete row** 버튼 클릭
3. 확인 대화상자에서 **Confirm** 클릭

> ⚠️ **주의**: 상품을 삭제하면 해당 상품이 장바구니(`cart_items`)에서도 자동으로 삭제됩니다 (CASCADE 설정).

## SQL을 사용한 대량 등록

여러 상품을 한 번에 등록하려면 SQL Editor를 사용할 수 있습니다:

1. Supabase Dashboard → **SQL Editor** 클릭
2. **New query** 클릭
3. 다음 SQL 예제를 참고하여 작성:

```sql
-- 여러 상품 한 번에 등록
INSERT INTO products (name, description, price, category, stock_quantity, is_active) VALUES
  ('면 100% 기본 티셔츠', '심플한 디자인, 5가지 컬러', 25000, 'clothing', 300, true),
  ('후드 집업 자켓', '부드러운 안감, 캐주얼 스타일', 68000, 'clothing', 150, true),
  ('청바지 슬림핏', '신축성 좋은 데님, 남녀공용', 79000, 'clothing', 180, true);
```

4. **Run** 클릭하여 실행

## 상품 필드 설명

### 필수 필드

- **name** (TEXT): 상품명
- **price** (DECIMAL): 가격 (최대 10자리, 소수점 2자리)
- **stock_quantity** (INTEGER): 재고 수량 (0 이상)
- **is_active** (BOOLEAN): 판매 활성화 여부

### 선택 필드

- **description** (TEXT): 상품 설명
- **category** (TEXT): 카테고리 코드

### 자동 생성 필드

- **id** (UUID): 상품 고유 ID (자동 생성)
- **created_at** (TIMESTAMPTZ): 생성 시간 (자동 생성)
- **updated_at** (TIMESTAMPTZ): 수정 시간 (자동 업데이트)

## 카테고리 코드 참고

| 코드 | 한글명 |
|------|--------|
| `clothing` | 의류 |
| `electronics` | 전자제품 |
| `books` | 도서 |
| `food` | 식품 |
| `sports` | 스포츠 |
| `beauty` | 뷰티 |
| `home` | 생활/가정 |

## 상품 관리 팁

### 1. 재고 관리

- 재고가 0이 되면 상품 상세 페이지에서 "품절"로 표시됩니다
- 재고가 10개 미만이면 "재고 부족" 경고가 표시됩니다
- 재고를 정기적으로 업데이트하여 정확한 정보를 유지하세요

### 2. 판매 중지

- 상품을 삭제하지 않고 판매만 중지하려면 `is_active`를 `false`로 설정
- 판매 중지된 상품은 상품 목록에 표시되지 않지만, URL로 직접 접근 시 안내 메시지가 표시됩니다

### 3. 가격 관리

- 가격은 소수점 2자리까지 입력 가능 (예: 25000.50)
- 가격 변경 시 `updated_at`이 자동으로 업데이트됩니다

### 4. 대량 업데이트

여러 상품의 가격을 일괄 변경하려면:

```sql
-- 특정 카테고리의 모든 상품 가격 10% 할인
UPDATE products
SET price = price * 0.9,
    updated_at = now()
WHERE category = 'clothing'
  AND is_active = true;
```

## 데이터 검증

상품 데이터를 입력할 때 다음 제약 조건이 적용됩니다:

- **price**: 0 이상이어야 함
- **stock_quantity**: 0 이상이어야 함
- **name**: 반드시 입력해야 함

제약 조건을 위반하면 에러가 발생하므로 주의하세요.

## 문제 해결

### 문제: 상품이 목록에 표시되지 않음

**원인 및 해결**:
1. `is_active`가 `false`인지 확인 → `true`로 변경
2. 상품이 실제로 등록되었는지 확인 → Table Editor에서 확인

### 문제: 가격이 올바르게 표시되지 않음

**원인 및 해결**:
1. `price` 필드가 숫자 형식인지 확인 (문자열이 아님)
2. 소수점이 있는 경우 소수점 2자리까지만 입력

### 문제: 재고 수량이 음수로 표시됨

**원인**: `stock_quantity`가 음수로 입력됨

**해결**: `stock_quantity`는 항상 0 이상이어야 합니다. 음수로 입력하면 에러가 발생합니다.

## 향후 개선 사항

Phase 2 이후 다음 기능이 추가될 수 있습니다:

- 어드민 대시보드 페이지
- 상품 이미지 업로드 (Supabase Storage)
- 상품 일괄 등록 (CSV 업로드)
- 상품 통계 및 분석

## 참고 자료

- [Supabase Table Editor 가이드](https://supabase.com/docs/guides/database/tables)
- [Supabase SQL Editor 가이드](https://supabase.com/docs/guides/database/overview)
- [프로젝트 데이터베이스 스키마](../supabase/migrations/db.sql)

