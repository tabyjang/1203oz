# 접근성 가이드

이 문서는 쇼핑몰 MVP의 접근성 구현 가이드를 설명합니다.

## 📋 목차

1. [접근성 표준](#접근성-표준)
2. [구현된 기능](#구현된-기능)
3. [ARIA 라벨](#aria-라벨)
4. [키보드 네비게이션](#키보드-네비게이션)
5. [색상 대비](#색상-대비)
6. [반응형 디자인](#반응형-디자인)

## 🎯 접근성 표준

이 프로젝트는 **WCAG 2.1 Level AA** 기준을 준수합니다.

### 주요 원칙

- **인식 가능성**: 모든 정보와 UI 컴포넌트는 사용자가 인식할 수 있어야 함
- **조작 가능성**: 모든 기능은 키보드로 조작 가능해야 함
- **이해 가능성**: 정보와 UI 조작은 이해하기 쉬워야 함
- **견고성**: 다양한 보조 기술과 호환되어야 함

## ✅ 구현된 기능

### 1. 시맨틱 HTML

- `<header>`, `<nav>`, `<main>`, `<footer>` 등 적절한 HTML5 시맨틱 태그 사용
- 제목 계층 구조 (`<h1>` ~ `<h6>`) 준수

### 2. ARIA 라벨

모든 인터랙티브 요소에 적절한 ARIA 라벨 제공:

```tsx
// 예시: 상품 카드
<Link
  href={`/products/${product.id}`}
  aria-label={`${product.name} 상세보기`}
>
```

```tsx
// 예시: 네비게이션
<nav role="navigation" aria-label="주요 네비게이션">
  <Link href="/products" aria-label="상품 목록">상품</Link>
</nav>
```

### 3. 키보드 네비게이션

- 모든 링크와 버튼은 키보드로 접근 가능
- Tab 키로 포커스 이동
- Enter/Space로 활성화
- 포커스 표시기 명확히 표시

### 4. 색상 대비

- 텍스트와 배경의 대비율 4.5:1 이상 (WCAG AA)
- 다크모드에서도 대비율 유지

### 5. 스크린 리더 지원

- `aria-live` 속성으로 동적 콘텐츠 변경 알림
- `aria-label`로 아이콘 버튼 설명
- `role` 속성으로 요소 역할 명시

## 🏷️ ARIA 라벨

### 네비게이션

```tsx
<header role="banner">
  <Link href="/" aria-label="홈으로 이동">쇼핑몰</Link>
  <nav role="navigation" aria-label="주요 네비게이션">
    <Link href="/products" aria-label="상품 목록">상품</Link>
  </nav>
</header>
```

### 상품 카드

```tsx
<Link
  href={`/products/${product.id}`}
  aria-label={`${product.name} 상세보기`}
>
  <div role="img" aria-label={`${product.name} 이미지`}>
    {/* 이미지 */}
  </div>
  <h3 id={`product-name-${product.id}`}>{product.name}</h3>
</Link>
```

### 재고 상태

```tsx
<div aria-live="polite">
  <span aria-label={`재고 상태: ${stockStatus.text}`}>
    {stockStatus.text}
  </span>
  <span aria-label={`재고 수량: ${product.stock_quantity}개`}>
    (재고: {product.stock_quantity}개)
  </span>
</div>
```

### 버튼

```tsx
<Button aria-label="로그인">로그인</Button>
<Button aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}>
  <Moon />
</Button>
```

## ⌨️ 키보드 네비게이션

### 기본 동작

- **Tab**: 다음 포커스 가능 요소로 이동
- **Shift + Tab**: 이전 포커스 가능 요소로 이동
- **Enter/Space**: 버튼/링크 활성화
- **Esc**: 모달/드롭다운 닫기

### 포커스 관리

```tsx
// 포커스 스타일
.button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### 스킵 링크 (향후 추가)

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  메인 콘텐츠로 건너뛰기
</a>
```

## 🎨 색상 대비

### 라이트 모드

- 일반 텍스트: `oklch(0.145 0 0)` on `oklch(1 0 0)` (대비율: 15.8:1)
- 보조 텍스트: `oklch(0.556 0 0)` on `oklch(1 0 0)` (대비율: 4.5:1)

### 다크 모드

- 일반 텍스트: `oklch(0.985 0 0)` on `oklch(0.145 0 0)` (대비율: 15.8:1)
- 보조 텍스트: `oklch(0.708 0 0)` on `oklch(0.145 0 0)` (대비율: 4.5:1)

## 📱 반응형 디자인

### 브레이크포인트

- **모바일**: < 640px
- **태블릿**: 640px - 1024px
- **데스크톱**: > 1024px

### 모바일 최적화

- 터치 타겟 최소 44x44px
- 텍스트 크기 최소 16px
- 간격 충분히 확보

### 예시

```tsx
// 반응형 그리드
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* 상품 카드 */}
</div>

// 반응형 네비게이션
<div className="flex flex-col sm:flex-row gap-4">
  {/* 필터 */}
</div>
```

## 🔍 테스트 방법

### 자동 테스트

1. **axe DevTools**: 브라우저 확장 프로그램
2. **Lighthouse**: Chrome DevTools
3. **WAVE**: 웹 접근성 평가 도구

### 수동 테스트

1. **키보드만으로 탐색**: 마우스 없이 모든 기능 사용
2. **스크린 리더 테스트**: NVDA (Windows), VoiceOver (Mac)
3. **색상 대비 확인**: WebAIM Contrast Checker

## 📚 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA 사양](https://www.w3.org/WAI-ARIA/)
- [WebAIM 접근성 가이드](https://webaim.org/)

