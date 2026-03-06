export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
