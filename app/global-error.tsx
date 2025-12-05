/**
 * @file app/global-error.tsx
 * @description 전역 에러 바운더리 (루트 레이아웃 에러)
 *
 * 루트 레이아웃에서 발생하는 에러를 처리하는 컴포넌트
 */

"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러 로깅
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
              오류가 발생했습니다
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              애플리케이션을 초기화하는 중 오류가 발생했습니다.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

