import { authorizedFetch } from './client';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/doctorservices`;

// get services linked to the currently logged-in doctor
export async function getMyDoctorServices() {
  const res = await authorizedFetch(`${API_URL}/my`, {
    method: 'GET',
  });
  return res.json();
}

// link a service to the current doctor
export async function linkDoctorService(servicecatalogid) {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ servicecatalogid }), // send service ID in body
  });
  return res.json();
}

// unlink (remove) a service from the current doctor
export async function unlinkDoctorService(id) {
  const res = await authorizedFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// get all services linked to a specific doctor by their ID
export async function getDoctorServicesById(doctorid) {
  const res = await authorizedFetch(`${API_URL}/${doctorid}`, {
    method: 'GET',
  });
  return res.json();
}

// get available time slots for a specific service
export async function getAvailableSlotsForService(servicecatalogid) {
  const res = await authorizedFetch(`${API_URL}/available/${servicecatalogid}`, {
    method: 'GET',
  });
  return res.json();
}
