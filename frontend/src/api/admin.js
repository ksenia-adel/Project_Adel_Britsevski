const API_URL = 'http://localhost:3001/api/admins';
const getToken = () => localStorage.getItem('token');

// fetch the list of all admins from the server
export async function getAdmins() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // send token for authentication
    },
  });
  return res.json(); // parse response as JSON
}

// send a request to create a new admin
export async function createAdmin(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), // convert JS object to JSON string
  });
  return res.json();
}

// send a request to update an existing admin by ID
export async function updateAdmin(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// send a request to delete an admin by ID
export async function deleteAdmin(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
