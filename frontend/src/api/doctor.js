import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/doctors`;

// fetch all doctors from the server
export async function getDoctors() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json();
}

// create a new doctor using form data
export async function createDoctor(data) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data), 
  });
  return res.json();
}

// update an existing doctor by ID
export async function updateDoctor(id, data) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete a doctor by ID
export async function deleteDoctor(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
