import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../authcontex';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrCpf: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const handleBack = () => {
    router.push('/agent');
  };

  const handleClose = () => {
    router.push('/');
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
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
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/agent/profile/login`, {
        // const response = await fetch('https://mapacultural.gestorcultural.com.br/api/agent/profile/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          emailOrCpf: formData.emailOrCpf.trim(),
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(errorData || 'Login failed');
      }

      const result = await response.json();

      if (result.token) {
        login(result.token, result.user);
        alert('Login successful!');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
    <div className="container py-3 border-0" style={{ background: '#fff' }}>
        <div className="d-flex align-items-center justify-content-between">
          {/* Left: Logo and Text */}
          <div className="d-flex gap-5 align-items-center">
          <Image src="/images/MadminLogo.jpg" alt="Gestor Cultural Logo" width={160} height={50} style={{ marginRight: 8 }} />
            <button   onClick={handleBack}
          className="btn btn-link text-decoration-none"
          style={{ color: '#1A2530', fontSize: '26px', border: '0.1px solid rgb(206, 206, 206)',borderRadius: '50%', background: 'rgba(26, 37, 48, 0.1)', height: '50px', width: '50px' }}
        >
          ← 
        </button>
        </div>
          {/* Right: Icons */}
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ background: '#D9DED9', width: 48, height: 48 }}>
              {/* Calendar Icon (placeholder SVG) */}
              <svg width="24" height="24" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </span>
            <span 
              className="d-flex align-items-center justify-content-center" 
              style={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={handleClose}
            >
              {/* Close Icon (X, placeholder SVG) */}
              <svg width="28" height="28" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', maxWidth: 400 }}>
      <h2 className="fw-bold text-center mb-3" style={{ fontSize: '2rem' }}>
        Olá de novo!
      </h2>
      <p className="text-center mb-4" style={{ fontSize: '1rem' }}>
        Ainda não tem uma conta no Mapa Cultural? <a href="/agent" className="fw-bold">Cadastre-se</a>
      </p>
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="emailOrCpf">
          <Form.Label style={{ fontSize: '16px' }}>Email ou CPF</Form.Label>
          <Form.Control 
            type="text" 
            name="emailOrCpf"
            value={formData.emailOrCpf}
            onChange={handleInputChange}
            className="p-3 rounded-4" 
            placeholder="Digite seu email ou CPF"
            disabled={isLoading}
            isInvalid={!!error}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label style={{ fontSize: '16px' }}>Senha</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="p-3 rounded-4"
              placeholder="Digite sua senha"
              disabled={isLoading}
              isInvalid={!!error}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {error && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {error}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Button
          type="submit"
          className="w-100 fw-bold"
          disabled={isLoading}
          style={{
            background: isLoading ? '#ccc' : '#A8EB7D',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.5rem',
            padding: '18px 0',
            color: '#222',
          }}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>
      <a href="#" className="mt-3" style={{ fontSize: '16px' }}>
        Esqueceu a senha?
      </a>
    </Container>
    </>
  );
}
