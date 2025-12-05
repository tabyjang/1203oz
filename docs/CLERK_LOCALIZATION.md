# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [기본 설정](#기본-설정)
3. [커스텀 로컬라이제이션](#커스텀-로컬라이제이션)
4. [사용 가능한 언어](#사용-가능한-언어)
5. [문제 해결](#문제-해결)

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 여러 언어를 지원합니다. 이 프로젝트는 한국어(`koKR`) 로컬라이제이션을 사용합니다.

### 지원되는 컴포넌트

로컬라이제이션은 다음 Clerk 컴포넌트에 적용됩니다:

- `SignIn` - 로그인 컴포넌트
- `SignUp` - 회원가입 컴포넌트
- `UserButton` - 사용자 버튼
- `UserProfile` - 사용자 프로필
- `OrganizationSwitcher` - 조직 전환
- 기타 모든 Clerk 컴포넌트

> ⚠️ **주의**: 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다. Clerk Account Portal(호스팅된 사용자 관리 페이지)은 여전히 영어로 표시됩니다.

## 기본 설정

프로젝트에는 이미 한국어 로컬라이제이션이 설정되어 있습니다:

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { currentLocalization } from "@/lib/clerk/localization";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={currentLocalization}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 설정 확인

1. **패키지 설치 확인**

```bash
pnpm list @clerk/localizations
```

2. **로컬라이제이션 파일 확인**

`lib/clerk/localization.ts` 파일에서 현재 설정을 확인할 수 있습니다.

3. **브라우저에서 확인**

- 로그인 버튼 클릭
- 로그인 모달이 한국어로 표시되는지 확인
- "이메일로 계속하기", "비밀번호" 등의 텍스트가 한국어인지 확인

## 커스텀 로컬라이제이션

특정 메시지를 커스터마이징하려면 `lib/clerk/localization.ts` 파일을 수정하세요.

### 에러 메시지 커스터마이징

```typescript
// lib/clerk/localization.ts
import { koKR } from "@clerk/localizations";

export const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access: 
      "이 이메일 도메인은 접근이 허용되지 않았습니다. 접근 권한이 필요하시면 관리자에게 문의해주세요.",
    form_identifier_not_found:
      "입력하신 이메일 또는 사용자 이름을 찾을 수 없습니다.",
  },
};
```

그리고 `app/layout.tsx`에서 `customKoKR`을 사용:

```tsx
import { customKoKR } from "@/lib/clerk/localization";

<ClerkProvider localization={customKoKR}>
  ...
</ClerkProvider>
```

### 로그인/회원가입 텍스트 커스터마이징

```typescript
export const customKoKR = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    title: "환영합니다",
    subtitle: "계정에 로그인하세요",
  },
  signUp: {
    ...koKR.signUp,
    title: "계정 만들기",
    subtitle: "새로운 계정을 생성하세요",
  },
};
```

### 사용 가능한 커스터마이징 필드

Clerk 로컬라이제이션 객체는 다음 필드를 포함합니다:

- `signIn` - 로그인 관련 텍스트
- `signUp` - 회원가입 관련 텍스트
- `userButton` - 사용자 버튼 관련 텍스트
- `userProfile` - 사용자 프로필 관련 텍스트
- `organizationSwitcher` - 조직 전환 관련 텍스트
- `unstable__errors` - 에러 메시지
- 기타 여러 필드들

전체 구조를 확인하려면 `@clerk/localizations` 패키지의 타입 정의를 참고하세요.

## 사용 가능한 언어

Clerk는 다음 언어를 지원합니다:

| 언어 | 키 | BCP 47 태그 |
|------|-----|-------------|
| 한국어 | `koKR` | `ko-KR` |
| 영어 (미국) | `enUS` | `en-US` |
| 영어 (영국) | `enGB` | `en-GB` |
| 일본어 | `jaJP` | `ja-JP` |
| 중국어 (간체) | `zhCN` | `zh-CN` |
| 중국어 (번체) | `zhTW` | `zh-TW` |
| 프랑스어 | `frFR` | `fr-FR` |
| 독일어 | `deDE` | `de-DE` |
| 스페인어 | `esES` | `es-ES` |
| 포르투갈어 (브라질) | `ptBR` | `pt-BR` |
| 러시아어 | `ruRU` | `ru-RU` |
| 아랍어 | `arSA` | `ar-SA` |
| 힌디어 | `hiIN` | `hi-IN` |
| 기타 40개 이상의 언어 |

전체 목록은 [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization#languages)를 참고하세요.

### 다른 언어로 변경하기

예를 들어, 일본어로 변경하려면:

```tsx
// app/layout.tsx
import { jaJP } from "@clerk/localizations";

<ClerkProvider localization={jaJP}>
  <html lang="ja">
    ...
  </html>
</ClerkProvider>
```

## 문제 해결

### 문제: 로컬라이제이션이 적용되지 않음

**원인 및 해결**:

1. **패키지가 설치되지 않음**
   ```bash
   pnpm add @clerk/localizations
   ```

2. **ClerkProvider에 localization prop이 전달되지 않음**
   ```tsx
   // ❌ 잘못된 예
   <ClerkProvider>
   
   // ✅ 올바른 예
   <ClerkProvider localization={koKR}>
   ```

3. **잘못된 import**
   ```tsx
   // ❌ 잘못된 예
   import { koKR } from "@clerk/nextjs";
   
   // ✅ 올바른 예
   import { koKR } from "@clerk/localizations";
   ```

### 문제: 일부 텍스트가 여전히 영어로 표시됨

**원인**: 
- Clerk Account Portal은 로컬라이제이션을 지원하지 않습니다
- 커스텀 컴포넌트의 텍스트는 로컬라이제이션의 영향을 받지 않습니다

**해결**:
- Account Portal은 영어로 유지됩니다 (Clerk 제한사항)
- 커스텀 컴포넌트의 텍스트는 직접 번역해야 합니다

### 문제: 특정 메시지를 찾을 수 없음

**원인**: 로컬라이제이션 객체의 구조를 잘못 이해함

**해결**:
1. `@clerk/localizations` 패키지의 타입 정의 확인
2. TypeScript 자동완성 활용
3. [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization) 참고

## 참고 자료

- [Clerk 로컬라이제이션 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)
- [@clerk/localizations 패키지](https://www.npmjs.com/package/@clerk/localizations)
- [프로젝트 로컬라이제이션 파일](../lib/clerk/localization.ts)

## 실험적 기능 안내

> ⚠️ **주의**: Clerk 로컬라이제이션 기능은 현재 실험적(experimental) 상태입니다. 예상치 못한 동작이 발생할 수 있으며, 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.




