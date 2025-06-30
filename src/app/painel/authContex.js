'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      console.log('🔐 Starting login process...');
      console.log('📧 Email:', email);
      console.log('🌐 API URL:', `${API_BASE_URL}/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      // If response is not ok (status 400, 401, etc.), it's an error
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        return { 
          success: false, 
          error: errorText || 'Email ou senha incorretos' 
        };
      }

      // If response is ok, try to get the token
      const data = await response.json();
      console.log('✅ Success response:', data);

      if (!data.token) {
        console.log('❌ No token in response');
        return { 
          success: false, 
          error: 'Resposta do servidor inválida - sem token' 
        };
      }

      // Store user data
      const userData = { 
        id: data.id || 'admin', 
        name: data.name || data.email || email,
        email, 
        role: 'admin' 
      };

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      setToken(data.token);
      setUser(userData);
      
      console.log('🎉 Login successful!');
      return { success: true };

    } catch (error) {
      console.log('💥 Network/Parse error:', error);
      
      // Network error (server not running, etc.)
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 4000.' 
        };
      }
      
      return { 
        success: false, 
        error: 'Algo deu errado. Por favor, tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
