import { useState, useEffect, useCallback } from 'react';

export function useListings(apiList, initialParams = {}) {
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await apiList(params);
      setData(res.data || []);
      const pagination = res.pagination || {};
      setTotal(pagination.total ?? res.total ?? 0);
      setTotalPages(pagination.totalPages ?? res.totalPages ?? 1);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [apiList, params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const setPage = (p) => setParams((prev) => ({ ...prev, page: p }));
  const setFilters = (next) => setParams((prev) => ({ ...prev, ...next, page: 1 }));

  return { data, total, totalPages, loading, error, params, setPage, setFilters, refetch: fetchList };
}
