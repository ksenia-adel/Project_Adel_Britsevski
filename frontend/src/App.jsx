import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// page components
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPages/AdminPage';
import DoctorPage from './pages/AdminPages/DoctorPage';
import ServiceCatalogPage from './pages/AdminPages/ServiceCatalogPage';
import DoctorSchedulePage from './pages/DoctorPages/DoctorSchedulePage';
import DoctorServicesPage from './pages/DoctorPages/DoctorServicesPage';
import DoctorMainPage from './pages/DoctorMainPage';
import AdminMainPage from './pages/AdminMainPage';
import PatientMainPage from './pages/PatientMainPage';
import FindDoctorPage from './pages/PatientPages/FindDoctorPage';
import MyBookingsPage from './pages/PatientPages/MyBookingsPage';
import PatientSmartBookingPage from './pages/PatientPages/PatientSmartBookingPage';
import ManagePatientsPage from './pages/AdminPages/ManagePatientsPage';
import StatisticsPage from './pages/AdminPages/StatisticsPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* public login page */}
          <Route path="/" element={<AuthPage />} />

          {/* admin pages */}
          <Route path="/admins" element={<AdminPage />} />
          <Route path="/admin/main" element={<AdminMainPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/services" element={<ServiceCatalogPage />} />
          <Route path="/patients" element={<ManagePatientsPage />} />
          <Route path="/doctors" element={<DoctorPage />} />

          {/* doctor pages */}
          <Route path="/doctor/main" element={<DoctorMainPage />} />
          <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
          <Route path="/doctor/services" element={<DoctorServicesPage />} />

          {/* patient pages */}
          <Route path="/patient/main" element={<PatientMainPage />} />
          <Route path="/find-doctors" element={<FindDoctorPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/book-smart" element={<PatientSmartBookingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
