import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, clearToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken().access);

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      saveToken({ access: newToken, refresh: getToken().refresh });
    } else {
      clearToken();
    }
  };

  useEffect(() => {
    const storedToken = getToken().access;
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
