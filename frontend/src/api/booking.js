const API_URL = 'http://localhost:3001/api/bookings';
const getToken = () => localStorage.getItem('token');

// create a new booking with selected service and schedule slot
export async function createBooking(data) {
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

// get bookings made by the current (logged-in) patient
export async function getMyBookings() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// cancel a specific booking by ID
export async function cancelBooking(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// mark a booking as paid
export async function payBooking(id) {
  const res = await fetch(`${API_URL}/${id}/pay`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// get bookings assigned to the current doctor
export async function getDoctorBookings() {
  const res = await fetch('http://localhost:3001/api/bookings/doctor', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
