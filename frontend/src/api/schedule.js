const API_URL = 'http://localhost:3001/api/schedules';
const getToken = () => localStorage.getItem('token');

// get the logged-in doctor's own schedule
export async function getMySchedule() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // send token in headers
    },
  });
  return res.json(); // return response as JSON
}

// create a new schedule slot
export async function createSlot(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // sending JSON data
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), // convert JS object to JSON string
  });
  return res.json();
}

// delete a schedule slot by ID
export async function deleteSlot(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// get public schedule for a specific doctor (by ID)
export async function getDoctorSchedule(doctorid) {
  const res = await fetch(`http://localhost:3001/api/schedules/doctors/${doctorid}`);
  return res.json();
}
