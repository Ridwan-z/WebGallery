// auth/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [userName, setUserName] = useState(localStorage.getItem('name'));
  const [Id, setId] = useState(localStorage.getItem('id'));
  const [fotoUser, setfotoUser] = useState(localStorage.getItem('foto_user'));

  const login = (token, name, id, foto_user) => {
    setAuthToken(token);
    setUserName(name);
    setId(id);
    setfotoUser(foto_user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('name', name);
    localStorage.setItem('id', id);
    localStorage.setItem('foto_user', foto_user);
  };

  const logout = () => {
    setAuthToken(null);
    setUserName(null);
    setId(null);
    setfotoUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('foto_user');
  };

  return (
    <AuthContext.Provider value={{ authToken, userName, Id, fotoUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
