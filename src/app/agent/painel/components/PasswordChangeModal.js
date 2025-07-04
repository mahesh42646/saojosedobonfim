"use client";
import React, { useState } from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

export default function PasswordChangeModal({ show, onHide, profile, onShowForgotPassword }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = localStorage.getItem("agentUser");
      const token = localStorage.getItem("agentToken");
      
      if (!userData || !token) {
        throw new Error('Authentication required');
      }

      const user = JSON.parse(userData);
      
      const response = await fetch(`${API_BASE_URL}/agent/profile/${user.cpf}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully');
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onHide();
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaLock />
          Alterar Senha
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* User Info Display */}
          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="mb-2">Informações da Conta</h6>
            <div>
              <div className="d-flex flex-wrap gap-2">
                <span className="text-muted">CPF:</span>
                <span className="fw-bold">{profile?.cpf || 'N/A'}</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="text-muted">Email:</span>
                <span className="fw-bold">{profile?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Current Password */}
          <Form.Group className="mb-3">
            <Form.Label>Senha Atual *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Digite sua senha atual"
                required
              />
              <Button
                type="button"
                variant="link"
                className="position-absolute end-0 top-0 h-100 border-0"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{ zIndex: 10 }}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* New Password */}
          <Form.Group className="mb-3">
            <Form.Label>Nova Senha *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Digite a nova senha"
                required
              />
              <Button
                type="button"
                variant="link"
                className="position-absolute end-0 top-0 h-100 border-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ zIndex: 10 }}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
            <Form.Text className="text-muted">
              A senha deve ter pelo menos 6 caracteres
            </Form.Text>
          </Form.Group>

          {/* Confirm New Password */}
          <Form.Group className="mb-4">
            <Form.Label>Confirmar Nova Senha *</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirme a nova senha"
                required
              />
              <Button
                type="button"
                variant="link"
                className="position-absolute end-0 top-0 h-100 border-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ zIndex: 10 }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* Security Notice */}
          <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded">
            <small className="text-warning">
              <strong>Importante:</strong> Após alterar sua senha, você será desconectado e precisará fazer login novamente.
            </small>
          </div>

          {/* Forgot Password Link */}
          {/* <div className="text-center">
            <Button 
              variant="link" 
              onClick={onShowForgotPassword}
              className="text-decoration-none"
            >
              Esqueci minha senha
            </Button>
          </div> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          style={{ backgroundColor: '#9FE870'}}
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 text-dark border btn "
        >
          {loading ? 'Alterando...' : 'Alterar Senha'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 