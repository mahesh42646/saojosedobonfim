"use client"
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Modal, ProgressBar } from 'react-bootstrap';
import { FaCamera, FaRegCalendar, FaInstagram, FaYoutube, FaFacebook, FaTimes, FaRegListAlt } from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';
import Image from 'next/image';
import { buildApiUrl } from '../../../config/api';

function NewProjectForm({ onClose, onSuccess, isEditing = false, projectData = null }) {
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
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [existingCoverPhoto, setExistingCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [tempDescription, setTempDescription] = useState(formData.description);

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditing && projectData) {
      setFormData({
        type: projectData.type || '',
        title: projectData.title || '',
        description: projectData.description || '',
        period: {
          start: projectData.period?.start ? new Date(projectData.period.start).toISOString().split('T')[0] : '',
          end: projectData.period?.end ? new Date(projectData.period.end).toISOString().split('T')[0] : ''
        }
      });

      // Set social links
      if (projectData.socialLinks) {
        setSocialLinks({
          instagram: { 
            enabled: !!projectData.socialLinks.instagram, 
            url: projectData.socialLinks.instagram || '' 
          },
          youtube: { 
            enabled: !!projectData.socialLinks.youtube, 
            url: projectData.socialLinks.youtube || '' 
          },
          facebook: { 
            enabled: !!projectData.socialLinks.facebook, 
            url: projectData.socialLinks.facebook || '' 
          }
        });
      }

      // Set existing photos
      if (projectData.photos) {
        setExistingPhotos(projectData.photos);
      }

      // Set existing cover photo
      if (projectData.coverPhoto) {
        setExistingCoverPhoto(projectData.coverPhoto);
      }

      setTempDescription(projectData.description || '');
    }
  }, [isEditing, projectData]);

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

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const handleRemoveExistingCoverPhoto = () => {
    setExistingCoverPhoto(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.title) newErrors.title = 'Nome é obrigatório';
    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    // if (!formData.period.start) newErrors.startDate = 'Data de início é obrigatória';
    if (!coverPhoto && !existingCoverPhoto) newErrors.coverPhoto = 'Foto de capa é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setUploadProgress(0);
      setSubmitError('');
      setShowUploadModal(true);
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

      // Add cover photo (only if new one selected)
      if (coverPhoto?.file) {
        formDataToSend.append('coverPhoto', coverPhoto.file);
      }

      // Add gallery photos (only new ones)
      photos.forEach(photo => {
        if (photo.file) {
          formDataToSend.append('photos', photo.file);
        }
      });

      // For editing, include existing photos to keep
      if (isEditing) {
        formDataToSend.append('existingPhotos', JSON.stringify(existingPhotos));
        if (existingCoverPhoto && !coverPhoto) {
          formDataToSend.append('keepExistingCoverPhoto', 'true');
        }
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        const expectedStatus = isEditing ? 200 : 201;
        
        if (xhr.status === expectedStatus) {
          setUploadProgress(100);
          setTimeout(() => {
            setShowUploadModal(false);
            setLoading(false);
            setUploadProgress(0);
            onSuccess();
          }, 1000);
        } else {
          let errorMessage = isEditing ? 'Falha ao atualizar projeto. Por favor, tente novamente.' : 'Falha ao criar projeto. Por favor, tente novamente.';
          
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.error) {
              errorMessage = response.error;
            }
          } catch (e) {
            // If response is not JSON, use status text
            if (xhr.status === 413) {
              errorMessage = 'Arquivos muito grandes. Reduza o tamanho dos arquivos e tente novamente.';
            } else if (xhr.status === 400) {
              errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
            } else if (xhr.status === 401) {
              errorMessage = 'Sessão expirada. Faça login novamente.';
            } else if (xhr.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (xhr.status >= 500) {
              errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
            }
          }
          
          setSubmitError(errorMessage);
          setLoading(false);
          setUploadProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.');
        setLoading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('abort', () => {
        setSubmitError(isEditing ? 'Atualização cancelada.' : 'Upload cancelado.');
        setLoading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('timeout', () => {
        setSubmitError(isEditing ? 'Atualização demorou muito tempo. Tente novamente.' : 'Upload demorou muito tempo. Tente novamente.');
        setLoading(false);
        setUploadProgress(0);
      });

      const method = isEditing ? 'PATCH' : 'POST';
      const endpoint = isEditing ? `/admin/project/${projectData._id}` : '/project';
      
      xhr.open(method, buildApiUrl(endpoint));
      xhr.setRequestHeader('Authorization', token);
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formDataToSend);

    } catch (error) {
      console.error(isEditing ? 'Error updating project:' : 'Error creating project:', error);
      setSubmitError(isEditing ? 'Falha ao atualizar projeto. Por favor, tente novamente.' : 'Falha ao criar projeto. Por favor, tente novamente.');
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Container className="col-lg-12">
      <h2 className="fs-5 fw-bold mb-4">{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Tipo de projeto *</Form.Label>
          <Form.Select 
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`rounded-3 py-2 border-dark ${errors.type ? 'is-invalid' : ''}`}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            Editar
          </Button>
        </div>

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Capa *</span>
            <small className="text-muted ms-auto">(Máx: 150MB)</small>
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
                  disabled={loading}
                >
                  <FaTimes />
                </Button>
              </div>
            ) : existingCoverPhoto ? (
              <div className="position-relative" style={{ width: "100%", height: "200px" }}>
                <Image 
                  src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${existingCoverPhoto}`} 
                  alt="" 
                  className="w-100 h-100 rounded-3 object-fit-cover" 
                  width={300} 
                  height={200} 
                />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1"
                  onClick={handleRemoveExistingCoverPhoto}
                  disabled={loading}
                >
                  <FaTimes />
                </Button>
                <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-2 py-1 small rounded-end">
                  Foto Atual
                </div>
              </div>
            ) : (
              <label className="d-flex align-items-center w-100 justify-content-center rounded-3" 
                     style={{ width: 100, height: "200px", cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: 'rgba(22, 51, 0, 0.08)', color: '#fff' }}>
                <input type="file" hidden onChange={handleCoverPhotoAdd} accept="image/*" disabled={loading} />
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* <div className="bg-light rounded-3 p-3 mb-3">
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
                disabled={loading}
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
                disabled={loading}
              />
            </Form.Group>
          </div>
        </div> */}

        <div className="rounded-3 p-3 mb-4" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Galeria de fotos</span>
            <small className="text-muted ms-auto">(Máx: 150MB por arquivo)</small>
          </Form.Label>
          <div className="d-flex gap-2 flex-wrap">
            {existingPhotos.map((photo, index) => (
              <div key={`existing-${index}`} className="position-relative" style={{ width: 100, height: 100 }}>
                <Image 
                  src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${photo}`} 
                  alt="" 
                  className="w-100 h-100 rounded-3 object-fit-cover" 
                  width={100} 
                  height={100} 
                />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1"
                  onClick={() => handleRemoveExistingPhoto(index)}
                  disabled={loading}
                >
                  <FaTimes />
                </Button>
                <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-1 small">
                  Atual
                </div>
              </div>
            ))}
            {photos.map((photo, index) => (
              <div key={`new-${index}`} className="position-relative" style={{ width: 100, height: 100 }}>
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
                  disabled={loading}
                >
                  <FaTimes />
                </Button>
                <div className="position-absolute bottom-0 start-0 bg-success bg-opacity-75 text-white px-1 small">
                  Nova
                </div>
              </div>
            ))}
            <label className="bg-white d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: 100, height: 100, cursor: loading ? 'not-allowed' : 'pointer' }}>
              <input type="file" hidden onChange={handlePhotoAdd} accept="image/*" multiple disabled={loading} />
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
          {loading ? (isEditing ? 'Atualizando...' : 'Salvando...') : (isEditing ? 'Atualizar' : 'Salvar')}
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

      {/* Upload Progress Modal */}
      <Modal 
        show={showUploadModal} 
        onHide={() => {}} 
        centered 
        backdrop="static" 
        keyboard={false}
      >
        <Modal.Header className="border-0">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32, backgroundColor: 'rgba(139, 195, 74, 0.1)'}}>
              <FaCamera className="text-success" />
            </div>
            <Modal.Title as="h6">
              {submitError ? (isEditing ? 'Erro na Atualização' : 'Erro no Upload') : 
               loading ? (isEditing ? 'Atualizando Projeto...' : 'Enviando Projeto...') : 
               (isEditing ? 'Atualização Concluída' : 'Upload Concluído')}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          {submitError ? (
            <div>
              <div className="mb-3">
                <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto" style={{width: 64, height: 64}}>
                  <FaTimes className="text-danger fs-4" />
                </div>
              </div>
              <h6 className="mb-3">{isEditing ? 'Falha na Atualização' : 'Falha no Upload'}</h6>
              <p className="text-muted mb-0">{submitError}</p>
            </div>
          ) : loading ? (
            <div>
              <div className="mb-3">
                <div className="spinner-border text-success" role="status" style={{width: 48, height: 48}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h6 className="mb-3">{isEditing ? 'Atualizando projeto...' : `Enviando arquivo${photos.length > 0 ? 's' : ''}...`}</h6>
              <ProgressBar 
                now={uploadProgress} 
                variant="success" 
                className="rounded-pill mb-2"
                style={{ height: '12px' }}
              />
              <p className="text-muted mb-0">{uploadProgress}% concluído</p>
              <small className="text-muted d-block mt-2">
                {isEditing ? 'Por favor, não feche esta janela durante a atualização' : 'Por favor, não feche esta janela durante o upload'}
              </small>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto" style={{width: 64, height: 64}}>
                  <FaCamera className="text-success fs-4" />
                </div>
              </div>
              <h6 className="mb-3">{isEditing ? 'Atualização Concluída!' : 'Upload Concluído!'}</h6>
              <p className="text-muted mb-0">{isEditing ? 'Projeto atualizado com sucesso' : 'Projeto criado com sucesso'}</p>
            </div>
          )}
        </Modal.Body>
        {submitError && (
          <Modal.Footer className="border-0">
            <Button 
              variant="outline-secondary" 
              className="me-2" 
              onClick={() => {
                setShowUploadModal(false);
                setSubmitError('');
              }}
            >
              Fechar
            </Button>
            <Button 
              variant="success" 
              style={{ backgroundColor: '#8BC34A', borderColor: '#8BC34A' }}
              onClick={() => {
                setShowUploadModal(false);
                setSubmitError('');
                // Retry the upload
                handleSubmit({ preventDefault: () => {} });
              }}
            >
              Tentar Novamente
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
}

export default NewProjectForm; 