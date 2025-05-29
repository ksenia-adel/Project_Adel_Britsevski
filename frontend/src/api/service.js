import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/services`;

// get all available services from the backend
export async function getServices() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json();
}

// create a new service with name, price, duration, etc.
export async function createService(data) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// update an existing service by ID
export async function updateService(id, data) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete a service by ID
export async function deleteService(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
