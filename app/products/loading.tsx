import { ProductListSkeleton } from "@/components/product-list-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="mb-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <ProductListSkeleton />
      </div>
    </div>
  );
}

