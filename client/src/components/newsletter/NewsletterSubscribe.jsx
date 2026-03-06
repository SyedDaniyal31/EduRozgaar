import { useState } from 'react';
import { newsletterApi } from '../../services/listingsService';
import { useToast } from '../../context/ToastContext';

export function NewsletterSubscribe({ compact = false }) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await newsletterApi.subscribe(trimmed, frequency);
      toast.success('Subscribed! You\'ll receive student alerts.');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Subscription failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full min-w-0 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full shrink-0 rounded-lg bg-primary hover:bg-primary-hover text-white btn-theme px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? '…' : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Get daily or weekly alerts: new jobs, scholarships, and admission deadlines.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm"
          disabled={loading}
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm w-full sm:w-32"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary hover:bg-primary-hover text-white btn-theme px-4 py-2 text-sm font-medium disabled:opacity-50 shrink-0"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
    </form>
  );
}
