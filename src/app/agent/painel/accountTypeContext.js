"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccountTypeContext = createContext();

export function AccountTypeProvider({ children }) {
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    // Initialize from localStorage if available
    const savedAccountType = localStorage.getItem('selectedAccountType');
    if (savedAccountType) {
      setAccountType(savedAccountType);
    }
  }, []);

  const updateAccountType = (type) => {
    setAccountType(type);
    localStorage.setItem('selectedAccountType', type);
  };

  return (
    <AccountTypeContext.Provider value={{ accountType, updateAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
}

export function useAccountType() {
  const context = useContext(AccountTypeContext);
  if (context === undefined) {
    throw new Error('useAccountType must be used within an AccountTypeProvider');
  }
  return context;
}
