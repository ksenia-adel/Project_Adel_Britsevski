import { useEffect, useState } from 'react';
import { getStatistics, saveStatistics } from '../../api/statistics';
import '../../styles/styles.css';

export default function StatisticsPage() {
  // store the statistics data from the server
  const [stats, setStats] = useState(null);
  // store any error messages that happen during loading
  const [error, setError] = useState('');
  // track whether data is being loaded (to show a spinner or disable buttons)
  const [loading, setLoading] = useState(false);
  // hook to navigate to another page
  // function to fetch statistics from the server
  const loadStats = async () => {
    setLoading(true);       // show loading spinner
    setError('');           // clear previous errors
    try {
      const res = await getStatistics(); // call the API function
      setStats(res);        // save the result in state
    } catch (err) {
      setError('Failed to load statistics'); // show error message
    } finally {
      setLoading(false);    // hide loading spinner
    }};

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
        await saveStatistics();
        alert('Report saved successfully!');
    } catch (err) {
        setError('Failed to save report');
    } finally {
        setLoading(false);
    }};

  // load stats when the component is first shown (mounted)
  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">SYSTEM STATISTICS</h2>
      <div className="form-buttons">
        <button className="btn btn-primary" onClick={loadStats} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        <button className="btn btn-success" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save report'}
        </button>
        </div>

      {/* if there is an error, show the message */}
      {error && <div className="error-message">{error}</div>}
      {/* if stats are not loaded yet, show a spinner. otherwise, show the cards */}
      {!stats ? (
        <div className="spinner"></div>
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Users" value={stats.users} color="blue" />
          <StatCard label="Total Admins" value={stats.admins} color="gray" />
          <StatCard label="Total Doctors" value={stats.doctors} color="green" />
          <StatCard label="Total Patients" value={stats.patients} color="purple" />
          <StatCard label="Total Bookings" value={stats.bookings} color="orange" />
        </div>
      )}
    </div>
  );
}

// component to display a single stat block (like total users or bookings)
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      {/* icon can be added here if needed */}
      <div className="card-icon">{icon}</div>
      {/* label like "Total Users" */}
      <div className="card-label">{label}</div>
      {/* value like 128, 300, etc. */}
      <div className="card-value">{value}</div>
    </div>
  );
}
