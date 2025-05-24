import { getToken } from './auth';
const API = 'http://localhost:3001/api/patients';

// fetch all patients (for admin use)
export async function getPatients() {
  const res = await fetch(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json(); 
}

// update a specific patient's information
export async function updatePatient(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete a patient by ID
export async function deletePatient(id) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
