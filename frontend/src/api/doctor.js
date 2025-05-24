const API_URL = 'http://localhost:3001/api/doctors';
const getToken = () => localStorage.getItem('token');

// fetch all doctors from the server
export async function getDoctors() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // include authentication token
    },
  });
  return res.json();
}

// create a new doctor using form data
export async function createDoctor(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), 
  });
  return res.json();
}

// update an existing doctor by ID
export async function updateDoctor(id, data) {
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

// delete a doctor by ID
export async function deleteDoctor(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
