/**
 * @file empty-state.tsx
 * @description 빈 상태 컴포넌트
 *
 * 데이터가 없을 때 표시하는 재사용 가능한 빈 상태 컴포넌트
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Icon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Link href={action.href}>
          <Button size="lg">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}

