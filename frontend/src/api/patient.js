import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/patients`;

// fetch all patients (for admin use)
export async function getPatients() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json(); 
}

// update a specific patient's information
export async function updatePatient(id, data) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete a patient by ID
export async function deletePatient(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
