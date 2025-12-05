import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 영역 */}
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

