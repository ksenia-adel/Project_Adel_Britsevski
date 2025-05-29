export async function authorizedFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/'; // redirect to login if no token
    return;
}
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // if token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/';
    return;
  }

  return response;
}
