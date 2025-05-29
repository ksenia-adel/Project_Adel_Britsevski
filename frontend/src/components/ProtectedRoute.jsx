import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // if no token – redirect to login page
    return <Navigate to="/" replace />;
  }
  return children;
}
