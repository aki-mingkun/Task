import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, clearToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Lấy username từ localStorage (ưu tiên key 'username')
  const [token, setTokenState] = useState(() => {
    const username = localStorage.getItem('username');
    return username || getToken().username || '';
  });

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      saveToken({ username: newToken });
    } else {
      clearToken();
    }
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setTokenState(username);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
