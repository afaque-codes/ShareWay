/**
 * ShareWay API Client
 * Provides automatic JWT authorization headers and transparent token refresh.
 */

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Includes HTTP-only refresh token cookie
  };

  let response = await fetch(endpoint, config);

  // If 401 Unauthorized, attempt refresh once
  if (response.status === 401 && !options._isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    try {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setAccessToken(refreshData.data.accessToken);

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
        return fetch(endpoint, {
          ...options,
          headers,
          credentials: 'include',
          _isRetry: true,
        });
      } else {
        setAccessToken(null);
      }
    } catch (err) {
      setAccessToken(null);
    }
  }

  return response;
};
