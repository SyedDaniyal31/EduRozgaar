/**
 * Lightweight request validation. For complex rules, consider express-validator.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body || {};
    for (const [key, config] of Object.entries(schema)) {
      const value = body[key];
      const { required, type } = config;
      if (required && (value === undefined || value === null || value === '')) {
        return res.status(400).json({ error: 'Validation failed', details: { [key]: `${key} is required` } });
      }
      if (value !== undefined && value !== null && type === 'string' && typeof value !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: { [key]: `${key} must be a string` } });
      }
      if (value !== undefined && value !== null && type === 'array' && !Array.isArray(value)) {
        return res.status(400).json({ error: 'Validation failed', details: { [key]: `${key} must be an array` } });
      }
    }
    next();
  };
}
