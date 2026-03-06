export function Button({ children, variant = 'primary', type = 'button', className = '', disabled, ...props }) {
  const base =
    'px-5 py-3 rounded-lg font-semibold btn-theme focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100';
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover',
    secondary:
      'bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 text-text-heading dark:text-white hover:bg-bg-section dark:hover:bg-gray-700',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary-light/30 dark:border-primary dark:text-primary dark:hover:bg-primary-light/20',
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
