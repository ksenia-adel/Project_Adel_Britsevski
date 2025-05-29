import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/schedules`;

// get the logged-in doctor's own schedule
export async function getMySchedule() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json();
}

// create a new schedule slot
export async function createSlot(data) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete a schedule slot by ID
export async function deleteSlot(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// get public schedule for a specific doctor (by ID)
export async function getDoctorSchedule(doctorid) {
  const res = await authorizedFetch(`${API_URL}/doctors/${doctorid}`, {
    method: 'GET',
  });
  return res.json();
}
