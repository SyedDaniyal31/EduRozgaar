/**
 * In-feed ad placeholder. Renders between listing cards (e.g. every 5–7 items).
 */
export function AdInFeed({ slotId = 'in-feed', index = 0 }) {
  return (
    <div
      className="w-full min-h-[100px] flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 my-2"
      data-ad-slot={slotId}
      data-ad-index={index}
    >
      <span className="text-xs text-gray-400 dark:text-gray-500">Ad</span>
    </div>
  );
}
