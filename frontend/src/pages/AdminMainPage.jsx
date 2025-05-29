import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import AdminPage from '../pages/AdminPages/AdminPage';
import DoctorPage from '../pages/AdminPages/DoctorPage';
import ServiceCatalogPage from '../pages/AdminPages/ServiceCatalogPage';
import ManagePatientsPage from '../pages/AdminPages/ManagePatientsPage';
import StatisticsPage from '../pages/AdminPages/StatisticsPage';

export default function AdminMainPage() {
  const [activeSection, setActiveSection] = useState('admins');
  const navigate = useNavigate();

  // logout: clear token and redirect to home
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // protect route: redirect if not admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // return component based on selected section
  const renderContent = () => {
    switch (activeSection) {
      case 'admins':
        return <AdminPage />;
      case 'doctors':
        return <DoctorPage />;
      case 'services':
        return <ServiceCatalogPage />;
      case 'patients':
        return <ManagePatientsPage />;
      case 'statistics':
        return <StatisticsPage />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="admin-layout">
      {/* sidebar navigation */}
      <aside className="sidebar">
        <h3>Welcome, Admin!</h3>
        <button className="btn btn-secondary" onClick={() => setActiveSection('admins')}>Admins management</button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('doctors')}>Doctors management</button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('services')}>Services management</button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('patients')}>Patients management</button>
        <button className="btn btn-secondary" onClick={() => setActiveSection('statistics')}>Statistics</button>
        <button className="btn btn-danger" onClick={handleLogout}>LOGOUT</button>
      </aside>

      {/* main section */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
