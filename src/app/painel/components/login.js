'use client';
import { useState } from 'react';
import { useAuth } from '../authContex';
import { useRouter } from 'next/navigation';
import HeaderM from './header';

const LoginPage = () => {
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
    e.stopPropagation();
    
    console.log('🚀 Form submitted - preventing default behavior');
    
    // Additional form validation
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return false;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔄 Submitting login form...');
      const result = await login(formData.email, formData.password);
      
      console.log('📊 Login result:', result);
      
      if (result && result.success) {
        console.log('✅ Login successful!');
        // No need to do anything else, the auth context will handle the state update
      } else {
        // Handle failed login - prevent page reload
        const errorMessage = result?.error || 'Email ou senha inválidos. Por favor, tente novamente.';
        console.log('❌ Setting error:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      const errorMessage = 'Email ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
    
    return false; // Prevent form submission
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Debug: Log when component renders
  console.log('🔄 Login component rendered, error state:', error);

  return (
    <div>
      <HeaderM/>
      <div className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
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
              <label style={{ fontSize: 12, color: '#888' }}>Seu email</label>
              <input 
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
            <a href="#" style={{ fontSize: 12, color: '#222', textDecoration: 'none' }}>Esqueceu a senha?</a>
          </div>
          
         
        </div>
      </div>
    </div> 
  );
};

export default LoginPage;
