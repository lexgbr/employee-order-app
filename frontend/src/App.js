import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import OrderForm from './components/OrderForm';
import ArchivedLists from './components/ArchivedLists';
import ExportButtons from './components/ExportButtons';
import ResetOrderList from './components/ResetOrderList';
import './App.css';

function App() {
  const { token, logout } = useAuth();
  const [view, setView] = useState('login'); // 'login' or 'register'

  if (!token) {
    return view === 'login'
      ? <LoginForm goToRegister={() => setView('register')} />
      : <RegisterForm goToLogin={() => setView('login')} />;
  }

  return (
    <>
      {/* Background wave and logo */}
      <div className="wave-background"></div>
      <div className="tng-logo-wrapper">
        <img src="/tng-logo.svg" alt="TNG Outdoor" className="tng-logo" />
      </div>

      <div className="App">
        <header style={{ padding: 20 }}>
          <h1>Order Management</h1>
          <button onClick={logout} style={{ marginTop: 10 }}>Logout</button>
        </header>

        <main style={{ padding: 20 }}>
          <OrderForm />
          <ExportButtons />
          <ResetOrderList />
          <ArchivedLists />
        </main>
      </div>
    </>
  );
}

export default App;
