const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD
  ? 'https://cricket-arena-backend.onrender.com/api'
  : '/api');

const TOKEN_KEY = 'token';
const TOKEN_TIMESTAMP_KEY = 'token_saved_at';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const savedAt = localStorage.getItem(TOKEN_TIMESTAMP_KEY);

  if (!token || !savedAt) {
    // Clean up any partial data
    removeAuthToken();
    return null;
  }

  const elapsed = Date.now() - parseInt(savedAt, 10);
  if (elapsed >= SEVEN_DAYS_MS) {
    // Token has expired after 7 days — auto-clear
    removeAuthToken();
    return null;
  }

  return token;
};

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, String(Date.now()));
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
