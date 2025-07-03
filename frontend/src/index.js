import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './ToastProvider'; // ✅ add this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider />  {/* ✅ toast support */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
