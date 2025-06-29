'use client';
import { useState } from 'react';
import { useAuth } from '../authContex';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to dashboard or desired page
        router.push('/superadmin/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      {/* Login Form */}
      <div style={{ width: 392, padding: 32, borderRadius: 12, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Olá novamente!</h2>
        
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
          {error && (
            <div className="alert alert-danger" role="alert" style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              border: '1px solid #f5c6cb', 
              fontSize: '14px',
              marginBottom: '10px',
              textAlign: 'center',
              fontWeight: '500',
              display: 'block'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ width: '100%' }}>
            <label style={{ fontSize: 12, color: '#888' }}>Seu e-mail</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: 4, 
                border: '1px solid #ccc', 
                marginTop: 4,
                boxSizing: 'border-box'
              }} 
              placeholder="Digite seu email"
              disabled={isLoading}
            />
          </div>
          
          <div style={{ width: '100%' }}>
            <label style={{ fontSize: 12, color: '#888' }}>Sua senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: 4, 
                  border: '1px solid #ccc', 
                  marginTop: 4,
                  boxSizing: 'border-box'
                }} 
                placeholder="Digite sua senha"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginTop: '2px'
                }}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px 0', 
              background: isLoading ? '#ccc' : '#9FE870', 
              color: '#222', 
              border: 'none', 
              borderRadius: 20, 
              fontWeight: 600, 
              fontSize: 16, 
              marginTop: 8, 
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={{ width: '100%', textAlign: 'left', marginTop: 12 }}>
          <button
            type="button"
            style={{ 
              fontSize: 12, 
              color: '#222', 
              textDecoration: 'none', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 0
            }}
            onClick={() => {
              // Handle forgot password logic here
              alert('Funcionalidade de recuperação de senha em breve!');
            }}
          >
           Esqueceu sua senha?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
