"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../authContex';

const EditProfile = ({ adminData, onBack }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    profilePhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || '',
        title: adminData.title || '',
        description: adminData.description || '',
        profilePhoto: null
      });
      if (adminData.profilePhoto) {
        setPreviewImage(`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${adminData.profilePhoto}`);
      }
    }
  }, [adminData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/profile/${adminData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso');
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Falha ao atualizar o perfil');
      }
    } catch (error) {
      setError('Algo deu errado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4" style={{ fontSize: '32px', fontWeight: '600' }}>
        Configurações de perfil público
      </h1>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      <div className="bg-white rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          {/* Banner Image Upload */}
          <div className="mb-4">
            <label className="mb-2">Imagem do banner</label>
            <div 
              className="rounded-4 position-relative"
              style={{ 
                background: '#F8F9FA',
                height: '200px',
                width: '100%',
                border: '2px dashed #DEE2E6',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => document.getElementById('photoInput').click()}
            >
              {previewImage ? (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#F8F9FA'
                }}>
                  <Image
                    src={previewImage}
                    alt="Pré-visualização do Perfil"
                    width={100}
                    height={100}
                    style={{ 
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                  <div style={{
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}>
                    <div className="rounded-circle bg-white mb-2" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-arrow-up"></i>
                    </div>
                    <p style={{ fontSize: '16px', margin: '0' }}>Clique para carregar ou arraste e solte</p>
                    <p style={{ fontSize: '14px', color: '#6c757d', margin: '4px 0 0 0' }}>O tamanho máximo do arquivo é 5 MB</p>
                  </div>
                </div>
              )}
              <input 
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Banner Title */}
          <div className="mb-4">
            <label className="mb-2">Título do banner</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{
                padding: '12px',
                border: '1px solid #DEE2E6',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-chat-left-text me-2"></i>
              <label>Descrição</label>
              <span className="text-danger ms-1">*</span>
            </div>
            <textarea 
              className="form-control" 
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                padding: '12px',
                border: '1px solid #DEE2E6',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Save Button */}
          <div className="d-flex justify-content-end">
            <button 
              type="button"
              className="btn me-2"
              onClick={onBack}
              style={{
                background: '#F8F9FA',
                borderRadius: '50px',
                padding: '8px 32px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{
                background: '#9FE870',
                borderRadius: '50px',
                padding: '8px 32px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
