import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [numeAngajat, setNumeAngajat] = useState(() => sessionStorage.getItem('numeAngajat'));

  const login = (newToken, newNumeAngajat) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('numeAngajat', newNumeAngajat);
    setToken(newToken);
    setNumeAngajat(newNumeAngajat);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('numeAngajat');
    setToken(null);
    setNumeAngajat(null);
  };

  return (
    <AuthContext.Provider value={{ token, numeAngajat, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
