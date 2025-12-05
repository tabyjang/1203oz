/**
 * Clerk 한국어 로컬라이제이션 설정
 * 
 * Clerk 컴포넌트의 모든 텍스트를 한국어로 표시합니다.
 * 기본 koKR 로컬라이제이션을 사용하며, 필요시 커스텀 메시지를 추가할 수 있습니다.
 * 
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */

import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

/**
 * 커스텀 한국어 로컬라이제이션
 * 
 * 기본 koKR 로컬라이제이션을 확장하여 특정 메시지를 커스터마이징할 수 있습니다.
 * 
 * @example
 * ```tsx
 * import { customKoKR } from '@/lib/clerk/localization';
 * 
 * <ClerkProvider localization={customKoKR}>
 *   ...
 * </ClerkProvider>
 * ```
 */
export const customKoKR: LocalizationResource = {
  ...koKR,
  
  // 에러 메시지 커스터마이징 (선택사항)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 예시: 특정 에러 메시지를 커스터마이징
    // not_allowed_access: "이메일 도메인이 허용되지 않았습니다. 접근 권한이 필요하시면 관리자에게 문의해주세요.",
  },
  
  // 필요시 다른 필드도 커스터마이징 가능
  // signIn: {
  //   ...koKR.signIn,
  //   title: "로그인",
  // },
};

/**
 * 기본 한국어 로컬라이제이션 (커스터마이징 없음)
 * 
 * Clerk에서 제공하는 기본 한국어 번역을 그대로 사용합니다.
 */
export { koKR };

/**
 * 현재 사용 중인 로컬라이제이션
 * 
 * 기본 koKR을 사용하거나, 커스터마이징이 필요한 경우 customKoKR을 사용하세요.
 */
export const currentLocalization = koKR;




