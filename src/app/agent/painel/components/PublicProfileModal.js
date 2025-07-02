"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaCamera, FaTrash, FaPlus } from "react-icons/fa";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

export default function PublicProfileModal({ show, onHide, profile, accountType, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    aboutText: '',
    socialLinks: {
      instagram: '',
      youtube: '',
      facebook: ''
    }
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enabledSocialLinks, setEnabledSocialLinks] = useState({
    instagram: false,
    youtube: false,
    facebook: false
  });
  const [galleryEnabled, setGalleryEnabled] = useState(false);

  useEffect(() => {
    if (profile && accountType) {
      const publicData = profile.publicProfile?.[accountType] || {};
      const currentPhoto = profile.profilePhotos?.[accountType];
      
      setFormData({
        aboutText: publicData.aboutText || '',
        socialLinks: {
          instagram: publicData.socialLinks?.instagram || '',
          youtube: publicData.socialLinks?.youtube || '',
          facebook: publicData.socialLinks?.facebook || ''
        }
      });

      // Set profile photo preview
      if (currentPhoto && currentPhoto.trim()) {
        setProfilePhotoPreview(`${API_BASE_URL.replace('/api', '')}/uploads/${currentPhoto.trim()}`);
      } else {
        setProfilePhotoPreview('');
      }

      // Set gallery previews
      if (publicData.galleryPhotos && publicData.galleryPhotos.length > 0) {
        setGalleryPreviews(publicData.galleryPhotos.map(photo => 
          `${API_BASE_URL.replace('/api', '')}/uploads/${photo.trim()}`
        ));
        setGalleryEnabled(true);
      } else {
        setGalleryPreviews([]);
        setGalleryEnabled(false);
      }

      // Set enabled social links
      setEnabledSocialLinks({
        instagram: !!publicData.socialLinks?.instagram,
        youtube: !!publicData.socialLinks?.youtube,
        facebook: !!publicData.socialLinks?.facebook
      });
    }
  }, [profile, accountType]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryPhotos(files);
    
    // Create previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSocialLinkToggle = (platform) => {
    setEnabledSocialLinks(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
    
    if (enabledSocialLinks[platform]) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: ''
        }
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = localStorage.getItem("agentUser");
      const token = localStorage.getItem("agentToken");
      
      if (!userData || !token) {
        throw new Error('Authentication required');
      }

      const user = JSON.parse(userData);
      const formDataToSend = new FormData();
      
      formDataToSend.append('accountType', accountType);
      formDataToSend.append('aboutText', formData.aboutText);

      // Add social links (only enabled ones)
      const socialLinksToSend = {};
      Object.keys(enabledSocialLinks).forEach(platform => {
        if (enabledSocialLinks[platform]) {
          socialLinksToSend[platform] = formData.socialLinks[platform];
        }
      });
      formDataToSend.append('socialLinks', JSON.stringify(socialLinksToSend));

      // Add profile photo if selected
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      // Add gallery photos if enabled and selected
      if (galleryEnabled && galleryPhotos.length > 0) {
        galleryPhotos.forEach(photo => {
          formDataToSend.append('galleryPhotos', photo);
        });
      }

      const response = await fetch(`${API_BASE_URL}/agent/profile/${user.cpf}/public`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        onProfileUpdate(result.profile);
        onHide();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Perfil Público</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Profile Photo */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 d-flex align-items-center">
                <FaCamera className="me-2" />
                Capa
              </h6>
            </div>
            <div 
              className="border border-dashed rounded-4 p-4 text-center position-relative"
              style={{ minHeight: 200, backgroundColor: '#f8f9fa' }}
            >
              {profilePhotoPreview ? (
                <div className="position-relative">
                  <Image
                    src={profilePhotoPreview}
                    alt="Profile"
                    width={150}
                    height={150}
                    className="rounded-4 object-fit-cover"
                    onError={(e) => {
                      console.error('Failed to load profile photo:', profilePhotoPreview);
                      setProfilePhotoPreview('');
                    }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-0 end-0 rounded-circle"
                    onClick={() => {
                      setProfilePhoto(null);
                      setProfilePhotoPreview('');
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ) : (
                <div>
                  <FaPlus size={30} className="text-muted mb-2" />
                  <p className="text-muted">Novo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="position-absolute w-100 h-100 opacity-0"
                style={{ top: 0, left: 0, cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* About Text */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0">Sobre *</h6>
              <Button variant="outline-secondary" size="sm">
                Editar
              </Button>
            </div>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.aboutText}
              onChange={(e) => setFormData(prev => ({ ...prev, aboutText: e.target.value }))}
              placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
            />
          </div>

          {/* Social Links */}
          <div className="mb-4">
            <h6 className="mb-3">Links do projeto</h6>
            
            {/* Instagram */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
              <span>Instagram</span>
              <Form.Check
                type="switch"
                checked={enabledSocialLinks.instagram}
                onChange={() => handleSocialLinkToggle('instagram')}
              />
            </div>
            {enabledSocialLinks.instagram && (
              <Form.Control
                type="url"
                placeholder="https://www.instagram.com/mapadacultura/"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                className="mb-3"
              />
            )}

            {/* YouTube */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
              <span>Youtube</span>
              <Form.Check
                type="switch"
                checked={enabledSocialLinks.youtube}
                onChange={() => handleSocialLinkToggle('youtube')}
              />
            </div>
            {enabledSocialLinks.youtube && (
              <Form.Control
                type="url"
                placeholder="https://www.youtube.com/mapadacultura"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                className="mb-3"
              />
            )}

            {/* Facebook */}
            <div className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
              <span>Facebook</span>
              <Form.Check
                type="switch"
                checked={enabledSocialLinks.facebook}
                onChange={() => handleSocialLinkToggle('facebook')}
              />
            </div>
            {enabledSocialLinks.facebook && (
              <Form.Control
                type="url"
                placeholder="https://www.facebook.com/mapadacultura/"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                className="mb-3"
              />
            )}
          </div>

          {/* Gallery */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between p-3 mb-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
              <span>Galeria de fotos</span>
              <Form.Check
                type="switch"
                checked={galleryEnabled}
                onChange={() => setGalleryEnabled(!galleryEnabled)}
              />
            </div>
            
            {galleryEnabled && (
              <div>
                <Row>
                  {galleryPreviews.map((preview, index) => (
                    <Col md={4} key={index} className="mb-3">
                      <div className="position-relative">
                        <Image
                          src={preview}
                          alt={`Gallery ${index + 1}`}
                          width={200}
                          height={150}
                          className="rounded-3 object-fit-cover w-100"
                          onError={(e) => {
                            console.error('Failed to load gallery photo:', preview);
                          }}
                        />
                        <Button
                          variant="light"
                          size="sm"
                          className="position-absolute top-0 end-0 rounded-circle m-2"
                          onClick={() => {
                            setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
                            setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Col>
                  ))}
                  <Col md={4} className="mb-3">
                    <div 
                      className="border border-dashed rounded-3 d-flex align-items-center justify-content-center position-relative"
                      style={{ height: 150, backgroundColor: '#f8f9fa' }}
                    >
                      <div className="text-center">
                        <FaPlus size={24} className="text-muted mb-1" />
                        <p className="text-muted mb-0">Novo</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryPhotosChange}
                        className="position-absolute w-100 h-100 opacity-0"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone *</Form.Label>
                <Form.Control
                  type="tel"
                  value={profile?.telephone || ''}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail *</Form.Label>
                <Form.Control
                  type="email"
                  value={profile?.email || ''}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-pill px-4"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 