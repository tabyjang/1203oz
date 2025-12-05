import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <PackageX className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          요청하신 상품이 존재하지 않거나 삭제되었습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button>상품 목록으로</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

