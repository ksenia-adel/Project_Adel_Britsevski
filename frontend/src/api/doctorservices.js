const API_URL = 'http://localhost:3001/api/doctorservices';
const getToken = () => localStorage.getItem('token');

// get services linked to the currently logged-in doctor
export async function getMyDoctorServices() {
  const res = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // attach token to request
    },
  });
  return res.json();
}

// link a service to the current doctor
export async function linkDoctorService(servicecatalogid) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ servicecatalogid }), // send service ID in body
  });
  return res.json();
}

// unlink (remove) a service from the current doctor
export async function unlinkDoctorService(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}

// get all services linked to a specific doctor by their ID
export async function getDoctorServicesById(doctorid) {
  const res = await fetch(`http://localhost:3001/api/doctorservices/${doctorid}`);
  return res.json();
}

// get available time slots for a specific service
export async function getAvailableSlotsForService(servicecatalogid) {
  const res = await fetch(`http://localhost:3001/api/doctorservices/available/${servicecatalogid}`);
  return res.json();
}
