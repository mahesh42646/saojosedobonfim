"use client";
import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { FaLock, FaEnvelope } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

export default function ForgotPasswordModal({ show, onHide }) {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!emailOrCpf.trim()) {
      setError('Por favor, insira seu email ou CPF');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/agent/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrCpf: emailOrCpf.trim() })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Se uma conta existir com este email/CPF, um link de redefinição de senha será enviado.');
        setEmailOrCpf('');
        // Close modal after 3 seconds
        setTimeout(() => {
          onHide();
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao processar solicitação');
      }
    } catch (error) {
      console.error('Error in forgot password:', error);
      setError('Erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmailOrCpf('');
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaLock />
          Esqueci minha senha
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <div className="mb-4">
          <p className="text-muted">
            Digite seu email ou CPF para receber instruções de redefinição de senha.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Email ou CPF *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                value={emailOrCpf}
                onChange={(e) => setEmailOrCpf(e.target.value)}
                placeholder="Digite seu email ou CPF"
                required
              />
              <FaEnvelope className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
            </div>
            <Form.Text className="text-muted">
              Você receberá um email com instruções para redefinir sua senha
            </Form.Text>
          </Form.Group>

          <div className="p-3 bg-info bg-opacity-10 rounded">
            <small className="text-info">
              <strong>Nota:</strong> Por questões de segurança, sempre enviaremos uma mensagem de confirmação, mesmo que o email/CPF não esteja cadastrado em nossa base de dados.
            </small>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          disabled={loading}
          className="px-4"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 