"use client"
import React from 'react';
import { AuthProvider, useAuth } from './authcontex';
import { AccountTypeProvider, useAccountType } from './accountTypeContext';
import Login from './components/login';
import AccountSelector from './components/account-selector';
import Sidebar from './components/sidebar';

// Main component that uses auth context
function AgentPanelContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { accountType, updateAccountType } = useAccountType();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Conditionally render based on authentication status and account selection
  if (!isAuthenticated) {
    return <Login />;
  }

  if (!accountType) {
    return <AccountSelector onAccountSelect={updateAccountType} />;
  }

  return <Sidebar />;
}

// Main page component with AuthProvider wrapper
export default function Page() {
  return (
    <AuthProvider >
      <AccountTypeProvider>
        <AgentPanelContent />
      </AccountTypeProvider>
    </AuthProvider>
  );
}
