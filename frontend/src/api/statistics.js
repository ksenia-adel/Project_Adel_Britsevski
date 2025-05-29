import { authorizedFetch } from './client';
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/statistics`;

// get system statistics
export async function getStatistics() {
  const res = await authorizedFetch(API_URL, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to load statistics');
  return res.json();
}

// save current statistics as a report
export async function saveStatistics() {
  const res = await authorizedFetch(API_URL, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Failed to save statistics');
  return res.json();
}
