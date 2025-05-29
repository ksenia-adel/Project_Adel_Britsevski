import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/admins`;

// fetch the list of all admins from the server
export async function getAdmins() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json();
}

// send a request to create a new admin
export async function createAdmin(data) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// send a request to update an existing admin by ID
export async function updateAdmin(id, data) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// send a request to delete an admin by ID
export async function deleteAdmin(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
