import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../authcontex';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrCpf: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

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
        // const response = await fetch('http://localhost:4000/api/agent/profile/login', {
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
  );
}
