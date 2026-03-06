export function Button({ children, variant = 'primary', type = 'button', className = '', disabled, ...props }) {
  const base =
    'px-4 py-2 rounded-lg font-medium btn-theme focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100';
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover shadow-sm',
    secondary:
      'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-mint/30 dark:hover:bg-mint/20 border border-gray-200 dark:border-gray-600',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-mint/20 dark:border-mint dark:text-mint dark:hover:bg-mint/10',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
