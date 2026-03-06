export function ListingCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
    </div>
  );
}
