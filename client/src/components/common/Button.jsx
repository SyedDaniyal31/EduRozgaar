export function Button({ children, variant = 'primary', type = 'button', className = '', disabled, ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
