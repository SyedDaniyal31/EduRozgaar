/**
 * Responsive banner ad slot. Replace slotId with your AdSense slot or use placeholder.
 * 728x90 desktop, responsive on mobile.
 */
export function AdBanner({ slotId = 'banner-top', className = '' }) {
  return (
    <div
      className={`w-full min-h-[90px] flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 ${className}`}
      data-ad-slot={slotId}
      data-ad-format="horizontal"
    >
      <span className="text-xs text-gray-400 dark:text-gray-500">Ad slot: {slotId}</span>
    </div>
  );
}
