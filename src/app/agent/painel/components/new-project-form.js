"use client"
import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { FaCamera, FaRegCalendar, FaInstagram, FaYoutube, FaFacebook, FaTimes, FaRegListAlt } from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';
import Image from 'next/image';

function NewProjectForm({ onClose }) {
  const [socialLinks, setSocialLinks] = useState({
    instagram: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' }
  });

  const [photos, setPhotos] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const [description, setDescription] = useState("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
  const [tempDescription, setTempDescription] = useState(description);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const handleSocialToggle = (platform) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: { ...prev[platform], enabled: !prev[platform].enabled }
    }));
  };

  const handlePhotoAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };

  return (
    <Container className="col-lg-8">
      <h2 className="fs-5 fw-bold mb-4">Novo Projeto</h2>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Tipo de projeto *</Form.Label>
          <Form.Select className="rounded-3 py-2 border-dark">
            <option>Selecione</option>
            <option>MOSTRA</option>
            <option>FESTIVAL</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Nome do projeto *</Form.Label>
          <Form.Control type="text" className="rounded-3 py-2 border-dark" />
        </Form.Group>

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
        <Form.Group>
            <Form.Label className="d-flex align-items-center gap-2 fs-6">
              <FaRegListAlt />
                <span>Descrição *</span>
            </Form.Label>
            <div
              className="border-1 bg-light rounded-3 p-3"
              style={{ borderColor: '#ced4da', minHeight: '100px' }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Form.Group>
          <Button className="w-100 text-dark rounded-5 mt-2" style={{ backgroundColor: '#fff', borderColor: '#8BC34A' }} onClick={() => {

            setTempDescription(description);
            setShowDescriptionModal(true);
          }}>Editar</Button>  
        </div>

        {/* <div className=" rounded-3  p-2 my-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}> */}
        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
              <span>Capa</span>
          </Form.Label>
          <div className="d-flex gap-2 p-3 flex-wrap rounded-3">
            {coverPhoto ? (
              <div className="position-relative" style={{ width: "100%", height: "200px" }}>
                <Image src={coverPhoto} alt="" className="w-100 h-100 rounded-3 object-fit-cover" width={300} height={200} />
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
          </div>
        </div>

        <div className="bg-light rounded-3 p-3 mb-3">
          <h6 className="mb-3">Links do projeto</h6>
          {Object.entries(socialLinks).map(([platform, { enabled, url }]) => (
            <div key={platform} className="mb-2">
              <div className="d-flex justify-content-between align-items-center p-2 border-dark border rounded-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
                <div className="d-flex align-items-center gap-2" >
                  
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
                  <Form.Control className="border-dark" type="url" placeholder={`Enter ${platform} URL`} value={url} 
                    onChange={(e) => setSocialLinks(prev => ({
                      ...prev,
                      [platform]: { ...prev[platform], url: e.target.value }
                    }))}
                  />
                  {/* <Button variant="outline-secondary" className="w-100 mt-2">Edit</Button> */}
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
              <Form.Control type="date" className="rounded-3 border-dark py-2" />
            </Form.Group>
            <Form.Group className="flex-grow-1">
              <Form.Label>Fim </Form.Label>
              <Form.Control type="date" className="rounded-3 border-dark py-2" />
            </Form.Group>
          </div>
        </div>

        <div className="b rounded-3 p-3 mb-4" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Galeria de fotos</span>
          </Form.Label>
          <div className="d-flex gap-2 flex-wrap">
            {photos.map((photo, index) => (
              <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
                <Image src={photo} alt="" className="w-100 h-100 rounded-3 object-fit-cover" width={100} height={100} />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1"
                  onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                >
                  <FaTimes />
                </Button>
              </div>
            ))}
            <label className="bg-white d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: 100, height: 100, cursor: 'pointer' }}>
              <input type="file" hidden onChange={handlePhotoAdd} accept="image/*" />
              <div className="text-center">
                <div className="rounded-circle bg-light p-2 mx-auto mb-1" style={{ width: 'fit-content' }}>
                  <span>+</span>
                </div>
                <small>Novo</small> 
              </div>
            </label>
          </div>
        </div>

        <Button  className="w-100 py-2 rounded-5" style={{ backgroundColor: '#8BC34A', borderColor: '#8BC34A' }}>
          Salvar
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
              setDescription(tempDescription);
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