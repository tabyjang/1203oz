/**
 * @file app/error.tsx
 * @description 전역 에러 바운더리
 *
 * 애플리케이션에서 발생하는 에러를 처리하는 컴포넌트
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 추적 서비스로 전송)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            오류가 발생했습니다
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              오류 ID: {error.digest}
            </p>
          )}
          <div className="flex gap-4">
            <Button onClick={reset} variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

