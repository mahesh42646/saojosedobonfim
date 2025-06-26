"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Context Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('agentToken');
      const userData = localStorage.getItem('agentUser');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      // Clear invalid data
      localStorage.removeItem('agentToken');
      localStorage.removeItem('agentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, userData) => {
    try {
      // Store in localStorage
      localStorage.setItem('agentToken', token);
      localStorage.setItem('agentUser', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('agentToken');
      localStorage.removeItem('agentUser');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('agentToken');
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

