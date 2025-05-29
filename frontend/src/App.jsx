import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

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
import ProtectedRoute from './components/ProtectedRoute'; // route guard

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* login page */}
          <Route path="/" element={<AuthPage />} />

          {/* admin pages */}
          <Route path="/admins" element={
            <ProtectedRoute><AdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/main" element={
            <ProtectedRoute><AdminMainPage /></ProtectedRoute>
          } />
          <Route path="/admin/statistics" element={
            <ProtectedRoute><StatisticsPage /></ProtectedRoute>
          } />
          <Route path="/services" element={
            <ProtectedRoute><ServiceCatalogPage /></ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute><ManagePatientsPage /></ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute><DoctorPage /></ProtectedRoute>
          } />

          {/* doctor pages */}
          <Route path="/doctor/main" element={
            <ProtectedRoute><DoctorMainPage /></ProtectedRoute>
          } />
          <Route path="/doctor/schedule" element={
            <ProtectedRoute><DoctorSchedulePage /></ProtectedRoute>
          } />
          <Route path="/doctor/services" element={
            <ProtectedRoute><DoctorServicesPage /></ProtectedRoute>
          } />

          {/* patient pages */}
          <Route path="/patient/main" element={
            <ProtectedRoute><PatientMainPage /></ProtectedRoute>
          } />
          <Route path="/find-doctors" element={
            <ProtectedRoute><FindDoctorPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />
          <Route path="/book-smart" element={
            <ProtectedRoute><PatientSmartBookingPage /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
