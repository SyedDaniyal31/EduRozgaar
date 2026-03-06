/**
 * Standard API response shape for list endpoints.
 * Frontend expects: data, pagination: { page, limit, total, totalPages }, filters (optional).
 */
export function listResponse(data, pagination, filters = null) {
  const payload = {
    data: data || [],
    pagination: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 10,
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 0,
    },
  };
  if (filters && typeof filters === 'object' && Object.keys(filters).length > 0) {
    payload.filters = filters;
  }
  return payload;
}

export function paginate(page = 1, limit = 10, total) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { page, limit, total, totalPages };
}
