/**
 * Sidebar ad. Hidden on mobile via className; show on md+.
 */
export function AdSidebar({ slotId = 'sidebar', className = '' }) {
  return (
    <aside className={`hidden md:block w-full min-h-[250px] ${className}`}>
      <div
        className="sticky top-20 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center min-h-[250px]"
        data-ad-slot={slotId}
      >
        <span className="text-xs text-gray-400 dark:text-gray-500">Ad: {slotId}</span>
      </div>
    </aside>
  );
}
