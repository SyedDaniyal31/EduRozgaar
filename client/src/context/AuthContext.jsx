import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/authService';

const STORAGE_TOKEN = 'edurozgaar-token';
const STORAGE_REFRESH = 'edurozgaar-refresh-token';
const STORAGE_USER = 'edurozgaar-user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistUser = useCallback((u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_USER);
  }, []);

  const setTokens = useCallback((accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem(STORAGE_TOKEN, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_REFRESH, refreshToken);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setError(null);
      const { data } = await authApi.login({ email, password });
      setTokens(data.accessToken, data.refreshToken);
      persistUser(data.user);
      return data.user;
    },
    [persistUser, setTokens]
  );

  const register = useCallback(
    async (payload) => {
      setError(null);
      const { data } = await authApi.register(payload);
      setTokens(data.accessToken, data.refreshToken);
      persistUser(data.user);
      return data.user;
    },
    [persistUser, setTokens]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearAuth();
  }, [clearAuth]);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem(STORAGE_REFRESH);
    if (!refresh) return null;
    try {
      const { data } = await authApi.refreshToken(refresh);
      setTokens(data.accessToken, data.refreshToken);
      persistUser(data.user);
      return data.accessToken;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth, persistUser, setTokens]);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ data }) => persistUser(data.user))
      .catch(() => clearAuth())
      .finally(() => setLoading(false));
  }, [clearAuth, persistUser]);

  const value = {
    user,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
    refreshToken,
    updateUser: persistUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
