import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const customer_id = localStorage.getItem('customer_id');
    if (token && customer_id) {
      setUser({ token, customer_id });
    }
  }, []);

  const login = (token, customer_id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('customer_id', customer_id);
    setUser({ token, customer_id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;