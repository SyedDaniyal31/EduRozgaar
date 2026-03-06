/**
 * Basic input sanitization to reduce XSS / NoSQL injection risk.
 * Use for string inputs before storing or querying.
 */
export function sanitizeString(str) {
  if (str == null || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/\0/g, '')
    .slice(0, 10000);
}

export function sanitizeObject(obj, maxKeys = 50) {
  if (obj == null || typeof obj !== 'object') return {};
  const keys = Object.keys(obj).slice(0, maxKeys);
  const out = {};
  for (const k of keys) {
    if (typeof obj[k] === 'string') out[k] = sanitizeString(obj[k]);
    else if (Array.isArray(obj[k])) out[k] = obj[k].filter((i) => typeof i === 'string').map(sanitizeString).slice(0, 200);
    else if (obj[k] != null && typeof obj[k] === 'object' && !(obj[k] instanceof Date)) out[k] = sanitizeObject(obj[k], 20);
    else out[k] = obj[k];
  }
  return out;
}
