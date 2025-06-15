// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/user/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Blad pobierania danych u¿ytkownika:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    axios.defaults.headers.common['Accept'] = 'application/json';
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserData]);

  const login = async (login, password) => {
    try {
      const response = await axios.post('/api/v1/auth/authenticate', {
        login: login,
        password: password
      });
      
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      const userResponse = await axios.get('/api/v1/user/me');
      setCurrentUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Blad logowania:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Blad logowania' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Blad podczas wylogowywania:', error);
    } finally {
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    currentUser,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
