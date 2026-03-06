import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const { variant = 'info', duration = 4000 } = options;
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (msg, opts) => addToast(msg, opts),
    [addToast]
  );
  toast.success = (msg, opts) => addToast(msg, { ...opts, variant: 'success' });
  toast.error = (msg, opts) => addToast(msg, { ...opts, variant: 'error' });
  toast.info = (msg, opts) => addToast(msg, { ...opts, variant: 'info' });
  toast.warning = (msg, opts) => addToast(msg, { ...opts, variant: 'warning' });

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;
  return (
    <div
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] flex flex-col gap-2 max-w-sm"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`rounded-lg border px-4 py-3 shadow-lg flex items-center justify-between gap-3 ${
            t.variant === 'success'
              ? 'bg-mint/20 dark:bg-mint/10 border-primary/30 dark:border-mint/30 text-primary dark:text-mint'
              : t.variant === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : t.variant === 'warning'
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          <span className="text-sm">{t.message}</span>
          <button
            type="button"
            onClick={() => onClose(t.id)}
            className="shrink-0 p-1 rounded hover:opacity-80"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
