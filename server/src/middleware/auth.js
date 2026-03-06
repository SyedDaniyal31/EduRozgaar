import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = verifyToken(token);
    if (decoded.type === 'refresh') {
      return res.status(401).json({ error: 'Use access token for this request' });
    }
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export const requireAdmin = requireRole('Admin');
export const requireUser = requireRole('User', 'Admin');
