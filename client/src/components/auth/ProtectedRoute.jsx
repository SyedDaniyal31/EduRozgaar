import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

/**
 * Protects routes that require authentication.
 * Redirects to Login if not authenticated; shows "Insufficient permissions" for wrong role.
 */
export function ProtectedRoute({ children, requireRole }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requireRole && !requireRole.includes(user.role)) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Insufficient permissions</h1>
        <p className="text-gray-600 dark:text-gray-400">You don&apos;t have access to this page.</p>
      </div>
    );
  }

  return children;
}
