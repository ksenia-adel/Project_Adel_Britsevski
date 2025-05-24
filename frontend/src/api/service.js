const API_URL = 'http://localhost:3001/api/services';
const getToken = () => localStorage.getItem('token');

// get all available services from the backend
export async function getServices() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json(); // return the response as JSON
}

// create a new service with name, price, duration, etc.
export async function createService(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // data is in JSON format
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), // convert object to JSON string
  });
  return res.json();
}

// update an existing service by ID
export async function updateService(id, data) {
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

// delete a service by ID
export async function deleteService(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
