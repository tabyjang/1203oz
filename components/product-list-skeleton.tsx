import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="h-full flex flex-col">
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <CardHeader className="flex-1">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

