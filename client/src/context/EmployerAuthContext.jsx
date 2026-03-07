import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { employerAuthApi } from '../services/employerService';
import { EMPLOYER_TOKEN_STORAGE } from '../services/employerService';

const STORAGE_EMPLOYER = 'edurozgaar-employer';

const EmployerAuthContext = createContext(null);

function readStoredEmployer() {
  try {
    const raw = localStorage.getItem(STORAGE_EMPLOYER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function EmployerAuthProvider({ children }) {
  const [employer, setEmployer] = useState(readStoredEmployer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistEmployer = useCallback((e) => {
    setEmployer(e);
    if (e) localStorage.setItem(STORAGE_EMPLOYER, JSON.stringify(e));
    else localStorage.removeItem(STORAGE_EMPLOYER);
  }, []);

  const setToken = useCallback((token) => {
    if (token) localStorage.setItem(EMPLOYER_TOKEN_STORAGE, token);
    else localStorage.removeItem(EMPLOYER_TOKEN_STORAGE);
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const { data } = await employerAuthApi.login(email, password);
    setToken(data.accessToken);
    persistEmployer(data.employer);
    return data.employer;
  }, [persistEmployer, setToken]);

  const register = useCallback(async (payload) => {
    const { data } = await employerAuthApi.register(payload);
    setToken(data.accessToken);
    persistEmployer(data.employer);
    return data.employer;
  }, [persistEmployer, setToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(EMPLOYER_TOKEN_STORAGE);
    persistEmployer(null);
  }, [persistEmployer]);

  useEffect(() => {
    const token = localStorage.getItem(EMPLOYER_TOKEN_STORAGE);
    if (!token) {
      setLoading(false);
      return;
    }
    employerAuthApi
      .me()
      .then(({ data }) => persistEmployer(data.employer))
      .catch(() => {
        localStorage.removeItem(EMPLOYER_TOKEN_STORAGE);
        persistEmployer(null);
      })
      .finally(() => setLoading(false));
  }, [persistEmployer]);

  const value = {
    employer,
    loading,
    error,
    setError,
    isAuthenticated: !!employer,
    login,
    register,
    logout,
  };

  return (
    <EmployerAuthContext.Provider value={value}>
      {children}
    </EmployerAuthContext.Provider>
  );
}

export function useEmployerAuth() {
  const ctx = useContext(EmployerAuthContext);
  if (!ctx) throw new Error('useEmployerAuth must be used within EmployerAuthProvider');
  return ctx;
}
