"use client"
import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { FaCamera, FaRegCalendar, FaInstagram, FaYoutube, FaFacebook, FaTimes, FaRegListAlt } from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';
import Image from 'next/image';
import { buildApiUrl } from '../../../config/api';

function NewProjectForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    period: {
      start: '',
      end: ''
    }
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' }
  });

  const [photos, setPhotos] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [tempDescription, setTempDescription] = useState(formData.description);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSocialToggle = (platform) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: { ...prev[platform], enabled: !prev[platform].enabled }
    }));
  };

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPhotos = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleCoverPhotoAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveCoverPhoto = () => {
    if (coverPhoto?.preview) {
      URL.revokeObjectURL(coverPhoto.preview);
    }
    setCoverPhoto(null);
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      if (newPhotos[index]?.preview) {
        URL.revokeObjectURL(newPhotos[index].preview);
      }
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.title) newErrors.title = 'Nome é obrigatório';
    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    if (!formData.period.start) newErrors.startDate = 'Data de início é obrigatória';
    if (!coverPhoto) newErrors.coverPhoto = 'Foto de capa é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('agentToken');
      
      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('period', JSON.stringify(formData.period));

      // Add social links
      const enabledSocialLinks = {};
      Object.entries(socialLinks).forEach(([platform, { enabled, url }]) => {
        if (enabled && url) {
          enabledSocialLinks[platform] = url;
        }
      });
      formDataToSend.append('socialLinks', JSON.stringify(enabledSocialLinks));

      // Add cover photo
      if (coverPhoto?.file) {
        formDataToSend.append('coverPhoto', coverPhoto.file);
      }

      // Add gallery photos
      photos.forEach(photo => {
        if (photo.file) {
          formDataToSend.append('photos', photo.file);
        }
      });

      const response = await fetch(buildApiUrl('/project'), {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Falha ao criar projeto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="col-lg-8">
      <h2 className="fs-5 fw-bold mb-4">Novo Projeto</h2>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Tipo de projeto *</Form.Label>
          <Form.Select 
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`rounded-3 py-2 border-dark ${errors.type ? 'is-invalid' : ''}`}
          >
            <option value="">Selecione</option>
            <option value="MOSTRA">MOSTRA</option>
            <option value="FESTIVAL">FESTIVAL</option>
          </Form.Select>
          {errors.type && <div className="invalid-feedback">{errors.type}</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Nome do projeto *</Form.Label>
          <Form.Control 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`rounded-3 py-2 border-dark ${errors.title ? 'is-invalid' : ''}`}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </Form.Group>

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Group>
            <Form.Label className="d-flex align-items-center gap-2 fs-6">
              <FaRegListAlt />
              <span>Descrição *</span>
            </Form.Label>
            <div
              className={`border-1 bg-light rounded-3 p-3 ${errors.description ? 'border-danger' : ''}`}
              style={{ borderColor: '#ced4da', minHeight: '100px' }}
              dangerouslySetInnerHTML={{ __html: formData.description }}
            />
            {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
          </Form.Group>
          <Button 
            className="w-100 text-dark rounded-5 mt-2" 
            style={{ backgroundColor: '#fff', borderColor: '#8BC34A' }} 
            onClick={() => {
              setTempDescription(formData.description);
              setShowDescriptionModal(true);
            }}
          >
            Editar
          </Button>
        </div>

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Capa *</span>
          </Form.Label>
          <div className="d-flex gap-2 p-3 flex-wrap rounded-3">
            {coverPhoto ? (
              <div className="position-relative" style={{ width: "100%", height: "200px" }}>
                <Image 
                  src={coverPhoto.preview} 
                  alt="" 
                  className="w-100 h-100 rounded-3 object-fit-cover" 
                  width={300} 
                  height={200} 
                />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1"
                  onClick={handleRemoveCoverPhoto}
                >
                  <FaTimes />
                </Button>
              </div>
            ) : (
              <label className="d-flex align-items-center w-100 justify-content-center rounded-3" 
                     style={{ width: 100, height: "200px", cursor: 'pointer', backgroundColor: 'rgba(22, 51, 0, 0.08)', color: '#fff' }}>
                <input type="file" hidden onChange={handleCoverPhotoAdd} accept="image/*" />
                <div className="text-center text-dark">
                  <div className="rounded-circle border bg-white p-2 mx-auto mb-1" style={{ width: 'fit-content', height:'44px', width:'44px' }}>
                    <span>+</span>
                  </div>
                  <small>Novo</small>
                </div>
              </label>
            )}
            {errors.coverPhoto && <div className="text-danger small w-100 text-center">{errors.coverPhoto}</div>}
          </div>
        </div>

        <div className="bg-light rounded-3 p-3 mb-3">
          <h6 className="mb-3">Links do projeto</h6>
          {Object.entries(socialLinks).map(([platform, { enabled, url }]) => (
            <div key={platform} className="mb-2">
              <div className="d-flex justify-content-between align-items-center p-2 border-dark border rounded-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
                <div className="d-flex align-items-center gap-2">
                  {platform === 'instagram' && <FaInstagram />}
                  {platform === 'youtube' && <FaYoutube />}
                  {platform === 'facebook' && <FaFacebook />}
                  <span className="text-capitalize">{platform}</span>
                </div>
                <Form.Check
                  type="switch"
                  checked={enabled}
                  onChange={() => handleSocialToggle(platform)}
                />
              </div>
              {enabled && (
                <div className="mt-2">
                  <Form.Control 
                    className="border-dark" 
                    type="url" 
                    placeholder={`Enter ${platform} URL`} 
                    value={url} 
                    onChange={(e) => setSocialLinks(prev => ({
                      ...prev,
                      [platform]: { ...prev[platform], url: e.target.value }
                    }))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-light rounded-3 p-3 mb-3">
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaRegCalendar className="text-secondary" />
            <span>Período de execução do projeto *</span>
          </Form.Label>
          <div className="d-flex gap-3">
            <Form.Group className="flex-grow-1">
              <Form.Label>Início *</Form.Label>
              <Form.Control 
                type="date" 
                name="period.start"
                value={formData.period.start}
                onChange={handleInputChange}
                className={`rounded-3 border-dark py-2 ${errors.startDate ? 'is-invalid' : ''}`}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </Form.Group>
            <Form.Group className="flex-grow-1">
              <Form.Label>Fim</Form.Label>
              <Form.Control 
                type="date" 
                name="period.end"
                value={formData.period.end}
                onChange={handleInputChange}
                className="rounded-3 border-dark py-2"
              />
            </Form.Group>
          </div>
        </div>

        <div className="rounded-3 p-3 mb-4" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Galeria de fotos</span>
          </Form.Label>
          <div className="d-flex gap-2 flex-wrap">
            {photos.map((photo, index) => (
              <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
                <Image 
                  src={photo.preview} 
                  alt="" 
                  className="w-100 h-100 rounded-3 object-fit-cover" 
                  width={100} 
                  height={100} 
                />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <FaTimes />
                </Button>
              </div>
            ))}
            <label className="bg-white d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: 100, height: 100, cursor: 'pointer' }}>
              <input type="file" hidden onChange={handlePhotoAdd} accept="image/*" multiple />
              <div className="text-center">
                <div className="rounded-circle bg-light p-2 mx-auto mb-1" style={{ width: 'fit-content' }}>
                  <span>+</span>
                </div>
                <small>Novo</small>
              </div>
            </label>
          </div>
        </div>

        <Button 
          type="submit"
          className="w-100 py-2 rounded-5" 
          style={{ backgroundColor: '#8BC34A', borderColor: '#8BC34A' }}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Form>

      <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32, backgroundColor: 'rgba(0,0,0,0.05)'}}>
              <FaRegListAlt />
            </div>
            <Modal.Title as="h6">Descrição *</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div style={{ minHeight: '300px' }}>
            <RichTextEditor 
              content={tempDescription}
              onChange={(html) => setTempDescription(html)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="success" 
            className="w-100 py-2 rounded-pill" 
            style={{ backgroundColor: '#8BC34A', borderColor: '#8BC34A' }}
            onClick={() => {
              setFormData(prev => ({ ...prev, description: tempDescription }));
              setShowDescriptionModal(false);
            }}
          >
            Salvar descrição
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default NewProjectForm; 