import { authorizedFetch } from './client';
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/bookings`;

// create a new booking with selected service and schedule slot
export async function createBooking(data) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// get bookings made by the current (logged-in) patient
export async function getMyBookings() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });
  return res.json();
}

// cancel a specific booking by ID
export async function cancelBooking(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// mark a booking as paid
export async function payBooking(id) {
  const res = await authorizedFetch(`${API_URL}/${id}/pay`, {
    method: 'PUT',
  });
  return res.json();
}

// get bookings assigned to the current doctor
export async function getDoctorBookings() {
  const res = await authorizedFetch(`${API_URL}/doctor`, {
    method: 'GET',
  });
  return res.json();
}
