import { useState } from 'react';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css';

// main component for login and registration
export default function AuthPage() {
  // toggle between login and register views
  const [isLogin, setIsLogin] = useState(true);
  // store login form data
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  // store registration form data
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    personalcode: '', });

  // store error messages
  const [error, setError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false); // login password visibility
  const [showRegisterPassword, setShowRegisterPassword] = useState(false); // registration password visibility
  // navigation hook
  const navigate = useNavigate();
  // handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginData.email, loginData.password);
    if (res.token) {
      // save token and role, redirect to appropriate dashboard
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.user.role);
      navigate(`/${res.user.role}/main`);
    } else {
      setError(res.message || 'Login failed');
    }};

  // handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(registerData);
    if (res.token) {
      // after registration, treat user as patient by default
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', 'patient');
      navigate('/patient/main');
    } else {
      setError(res.message || 'Registration failed');
    }};

  return (
    <div className="auth-page">
    {/* Title and description */}
        <div className="auth-header">
          <h1>BookMyDoc</h1>
          <p>Smart booking system for doctors and patients</p>
        </div>
      <div className="auth-card">
        {/* tab buttons for switching between login and register */}
        <div className="auth-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        {/* show error message if there is one */}
        {error && <p className="auth-error">{error}</p>}

        {/* login form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
  
            />
            <div className="password-wrapper">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowLoginPassword(prev => !prev)}
              >
                {showLoginPassword ? '🚫' : '👁️‍🗨️'}
              </button>
            </div>
            <button type="submit">Sign In</button>
          </form>
        ) : (
          // registration form
          <form onSubmit={handleRegister} className="auth-form">
            <input placeholder="Email" name="email" onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
             <div className="password-wrapper">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowRegisterPassword(prev => !prev)}
              >
                {showRegisterPassword ? '🚫' : '👁️‍🗨️'}
              </button>
            </div>
            <input type="password" placeholder="Password" name="password" onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
            <input placeholder="First Name" name="firstname" onChange={(e) => setRegisterData({ ...registerData, firstname: e.target.value })} required />
            <input placeholder="Last Name" name="lastname" onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })} required />
            <input placeholder="Phone" name="phone" onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} required />
            <input placeholder="Address" name="address" onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} required />
            <input placeholder="Personal Code" name="personalcode" onChange={(e) => setRegisterData({ ...registerData, personalcode: e.target.value })} required />
            <button type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}
