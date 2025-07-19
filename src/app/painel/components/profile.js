"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EditProfile from './editprofile';
import { useAuth } from '../authContex';
import { useRouter } from 'next/navigation';

// Component imports (will be created)
const PersonalDataForm = ({ userData, onBack }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    employeeType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.role === 'staff' ? userData.fullName : userData.name || '',
        email: userData.email || '',
        cpf: userData.cpf || '',
        employeeType: userData.employeeType || ''
      });
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = new FormData();
      if (userData.role === 'staff') {
        updateData.append('fullName', formData.name);
        updateData.append('cpf', formData.cpf);
        updateData.append('employeeType', formData.employeeType);
      } else {
        updateData.append('name', formData.name);
      }
      updateData.append('email', formData.email);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/unified/profile/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        body: updateData
      });

      if (response.ok) {
        setSuccess('Dados pessoais atualizados com sucesso');
        setTimeout(() => onBack(), 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Falha ao atualizar dados pessoais');
      }
    } catch (error) {
      setError('Algo deu errado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4" style={{ fontSize: '32px', fontWeight: '600' }}>Dados pessoais</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="bg-white rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2">Nome completo</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2">Email</label>
            <input 
              type="email" 
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          {userData?.role === 'staff' && (
            <>
              <div className="mb-4">
                <label className="mb-2">CPF</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="mb-2">Tipo de funcionário</label>
                <select 
                  className="form-control"
                  value={formData.employeeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeType: e.target.value }))}
                  style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
                >
                  <option value="Evaluator">Avaliador</option>
                  <option value="Manager">Gerente</option>
                  <option value="Other">Outro</option>
                </select>
              </div>
            </>
          )}

          <div className="d-flex justify-content-end">
            <button 
              type="button"
              className="btn me-2"
              onClick={onBack}
              style={{ background: '#F8F9FA', borderRadius: '50px', padding: '8px 32px' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{ background: '#9FE870', borderRadius: '50px', padding: '8px 32px' }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PasswordChangeModal = ({ userData, onBack }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('A nova senha e confirmação não coincidem');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('currentPassword', formData.currentPassword);
      updateData.append('newPassword', formData.newPassword);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/unified/profile/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        body: updateData
      });

      if (response.ok) {
        setSuccess('Senha alterada com sucesso');
        setTimeout(() => onBack(), 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Falha ao alterar senha');
      }
    } catch (error) {
      setError('Algo deu errado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4" style={{ fontSize: '32px', fontWeight: '600' }}>Segurança e privacidade</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="bg-white rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2">Senha atual</label>
            <input 
              type="password" 
              className="form-control"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2">Nova senha</label>
            <input 
              type="password" 
              className="form-control"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2">Confirmar nova senha</label>
            <input 
              type="password" 
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          <div className="d-flex justify-content-end">
            <button 
              type="button"
              className="btn me-2"
              onClick={onBack}
              style={{ background: '#F8F9FA', borderRadius: '50px', padding: '8px 32px' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{ background: '#9FE870', borderRadius: '50px', padding: '8px 32px' }}
            >
              {loading ? 'Alterando...' : 'Alterar senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CloseAccountModal = ({ userData, onBack }) => {
  const { token, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, just show confirmation dialog
      // In a real app, you'd implement account deactivation
      alert('Funcionalidade de encerramento de conta será implementada em breve.');
      onBack();
    } catch (error) {
      setError('Algo deu errado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4" style={{ fontSize: '32px', fontWeight: '600' }}>Encerrar a conta</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="bg-white rounded-4 p-4">
        <div className="alert alert-warning">
          <strong>Atenção:</strong> Esta ação é irreversível. Ao encerrar sua conta, todos os seus dados serão permanentemente removidos.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2">Digite sua senha para confirmar</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '12px', border: '1px solid #DEE2E6', borderRadius: '8px' }}
            />
          </div>

          <div className="mb-4">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={confirmClose}
                onChange={(e) => setConfirmClose(e.target.checked)}
                id="confirmClose"
              />
              <label className="form-check-label" htmlFor="confirmClose">
                Eu entendo que esta ação é irreversível
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button 
              type="button"
              className="btn me-2"
              onClick={onBack}
              style={{ background: '#F8F9FA', borderRadius: '50px', padding: '8px 32px' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-danger"
              disabled={loading || !confirmClose}
              style={{ borderRadius: '50px', padding: '8px 32px' }}
            >
              {loading ? 'Encerrando...' : 'Encerrar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCloseAccount, setShowCloseAccount] = useState(false);
  const [userData, setUserData] = useState(null);
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/painel');
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/unified/profile`, {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  const handleBackAndRefresh = (setterFunction) => {
    setterFunction(false);
    fetchUserProfile(); // Refresh user data
  };

  // Component renderers
  if (showEditProfile) {
    return <EditProfile adminData={userData} onBack={() => handleBackAndRefresh(setShowEditProfile)} />;
  }

  if (showPersonalData) {
    return <PersonalDataForm userData={userData} onBack={() => handleBackAndRefresh(setShowPersonalData)} />;
  }

  if (showPasswordChange) {
    return <PasswordChangeModal userData={userData} onBack={() => handleBackAndRefresh(setShowPasswordChange)} />;
  }

  if (showCloseAccount) {
    return <CloseAccountModal userData={userData} onBack={() => handleBackAndRefresh(setShowCloseAccount)} />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-5 py-lg-5 ">
          <div className="bg-light rounded-4 my-1 p-4" style={{ background: '#F5FFF0', width:"404px", height:"303px" }}>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                {userData?.profilePhoto && userData.profilePhoto.trim() ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${userData.profilePhoto.trim()}`}
                    alt="Perfil"
                    width={100}
                    height={100}
                    className="rounded-circle border"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src="/images/placeholder-Avatar.png"
                    alt="Perfil Padrão"
                    width={100}
                    height={100}
                    className="rounded-circle border"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <h2 className="py-4 my-2" style={{ fontSize: '24px', fontWeight: '600' }}>
                {userData?.role === 'staff' ? userData?.fullName : userData?.name || 'Carregando...'}
              </h2>
              {(userData?.title || userData?.employeeType) && (
                <p className="text-muted mb-2">{userData?.role === 'staff' ? userData?.employeeType : userData?.title}</p>
              )}
              {userData?.description && (
                <p className="text-muted small">{userData.description}</p>
              )}
            </div>
          </div>
          <div className="d-flex py-2 justify-content-center align-items-center">
            <button 
              className="btn" 
              onClick={handleLogout}
              style={{ 
                background: '#F8F9FA',
                border: '1px solid #F5FFF0',
                borderRadius: '50px',
                padding: '8px 24px',
                color: '#212529'
              }}
            >
              Sair
            </button>
          </div>
        </div>
        

        {/* Right Section */}
        <div className="col-md-7">
          <h1 className="mb-3" style={{ fontSize: '32px', fontWeight: '700' }}>Configurações</h1>
          
          {/* Settings Options */}
          <div>
            {/* Public Profile Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setShowEditProfile(true)}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-arrow-left-right fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Perfil Público</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Atualize seus dados públicos.</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>

            {/* Personal Data Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setShowPersonalData(true)}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-person fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Dados pessoais</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Atualize os seus dados pessoais.</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>

            {/* Security Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setShowPasswordChange(true)}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-shield fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Segurança e privacidade</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Alterar senha</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>

            {/* Close Account Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setShowCloseAccount(true)}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-x-circle fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Encerrar a conta</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Encerre a sua conta pessoal.</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 