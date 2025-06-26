"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/sidebar';
import Login from './components/login';
import { AuthProvider, useAuth } from './authContex';

// Protected component that requires authentication
function ProtectedAdminContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, show login
    if (!loading && !isAuthenticated()) {
      // Don't redirect, just show login component
      return;
    }
  }, [loading, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated()) {
    return <Login />;
  }

  // If authenticated, show the main admin panel with sidebar
  return (
    <div>
      <Sidebar />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <ProtectedAdminContent />
    </AuthProvider>
  );
}
