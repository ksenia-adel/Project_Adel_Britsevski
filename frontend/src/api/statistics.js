import { getToken } from './auth';

// get system statistics
export async function getStatistics() {
  const res = await fetch('http://localhost:3001/api/statistics', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error('Failed to load statistics');
  return res.json();
}

// save current statistics as a report
export async function saveStatistics() {
  const res = await fetch('http://localhost:3001/api/statistics', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error('Failed to save statistics');
  return res.json();
}
