import { useState } from 'react';
import '../styles/styles.css';
import MyBookingsPage from './PatientPages/MyBookingsPage';
import FindDoctorPage from './PatientPages/FindDoctorPage';
import PatientSmartBookingPage from './PatientPages/PatientSmartBookingPage';

// main dashboard component for patients
export default function PatientMainPage() {
  // track which section the user has selected
  const [activeSection, setActiveSection] = useState('bookings');

  // logout function: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  // return the correct page component based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'bookings':
        return <MyBookingsPage />;
      case 'find':
        return <FindDoctorPage />;
      case 'new':
        return <PatientSmartBookingPage />;
      default:
        return <p>Select something from the menu →</p>;
    }
  };

  return (
    <div className="admin-layout">
      {/* sidebar navigation for patients */}
      <aside className="sidebar">
        <h3>WELCOME</h3>
        {/* menu buttons */}
        <button className="btn btn-secondary" onClick={() => setActiveSection('find')}>
          Find Doctor
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('bookings')}>
          My Bookings
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('new')}>
          New Booking
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* main area to display selected section */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
