import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const { token, logout } = useAuth();
  const [view, setView] = useState('login');

  if (!token) {
    return view === 'login'
      ? <LoginForm goToRegister={() => setView('register')} />
      : <RegisterForm goToLogin={() => setView('login')} />;
  }

  return <DashboardPage onLogout={logout} />;
}

export default App;
