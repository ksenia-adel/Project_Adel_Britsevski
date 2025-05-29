const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

// send login request with email and password
export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// send registration request with user data
export async function register(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // data should be an object with registration fields
  });
  return response.json();
}

// get saved token from local storage
export function getToken() {
  return localStorage.getItem('token');
}
