export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDeadline(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function daysUntil(dateStr) {
  const d = formatDeadline(dateStr);
  if (!d) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - now) / (24 * 60 * 60 * 1000));
  return diff;
}
