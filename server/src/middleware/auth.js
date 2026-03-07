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
    if (decoded.employerId && decoded.role === 'employer') {
      req.employer = { employerId: decoded.employerId, role: 'employer' };
    } else {
      req.user = { userId: decoded.userId, role: decoded.role };
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Requires a User token (not Employer). Use for candidate-facing routes. */
export function requireUserAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.employer) {
    return res.status(403).json({ error: 'Employer account cannot access this resource' });
  }
  next();
}

/** Requires an Employer token. Use for employer dashboard routes. */
export function requireEmployerAuth(req, res, next) {
  if (!req.employer) {
    return res.status(401).json({ error: 'Employer authentication required' });
  }
  next();
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
