import { useState } from 'react';
import '../styles/styles.css';
import DoctorSchedulePage from './DoctorPages/DoctorSchedulePage';
import DoctorServicesPage from './DoctorPages/DoctorServicesPage';
import DoctorBookingsPage from './DoctorPages/DoctorBookingsPage';

// main dashboard component for doctors
export default function DoctorMainPage() {
  // track which section (tab) is currently active
  const [activeSection, setActiveSection] = useState('schedule');

  // logout function: clear user data and redirect to home
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  // return the component to render based on the selected section
  const renderContent = () => {
    switch (activeSection) {
      case 'schedule':
        return <DoctorSchedulePage />;
      case 'services':
        return <DoctorServicesPage />;
      case 'bookings':
        return <DoctorBookingsPage />;
      default:
        return <p>Select a section from the menu →</p>;
    }};

  return (
    <div className="admin-layout">
      {/* sidebar navigation for doctors */}
      <aside className="sidebar">
        <h3>Welcome, Doc!</h3>

        {/* section buttons */}
        <button className="btn btn-secondary" onClick={() => setActiveSection('schedule')}>
          Schedule
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('services')}>
          Services
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('bookings')}>
          My Bookings
        </button>

        {/* logout button */}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* main content area */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
