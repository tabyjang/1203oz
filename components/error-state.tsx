/**
 * @file error-state.tsx
 * @description 에러 상태 컴포넌트
 *
 * 에러가 발생했을 때 표시하는 재사용 가능한 에러 상태 컴포넌트
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "오류가 발생했습니다",
  message,
  onRetry,
  retryLabel = "다시 시도",
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

