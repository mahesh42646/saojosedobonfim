"use client"
import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import { FaCamera, FaInstagram, FaYoutube, FaFacebook, FaTimes, FaChevronDown, FaRegListAlt, FaChevronUp, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'next/image';

function NewSpaceForm({ onClose }) {
  const [socialLinks, setSocialLinks] = useState({
    instagram: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' }
  });

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [accessibilityOpen, setAccessibilityOpen] = useState(true);

  const [description, setDescription] = useState("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
  const [tempDescription, setTempDescription] = useState(description);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const [mapLink, setMapLink] = useState('');
  const [tempMapLink, setTempMapLink] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);

  const [physicalAccessibility, setPhysicalAccessibility] = useState({
    adaptedToilets: false,
    accessRamp: false,
    elevator: false,
    tactileSignaling: false,
    adaptedDrinkingFountain: false,
    handrail: false,
    adaptedElevator: false,
  });

  const handleAccessibilityChange = (e) => {
    const { name, checked } = e.target;
    setPhysicalAccessibility(prev => ({ ...prev, [name]: checked }));
  };

  const handleSocialToggle = (platform) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: { ...prev[platform], enabled: !prev[platform].enabled }
    }));
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

  const convertShareLinkToEmbed = (shareLink) => {
    try {
      const googleMapsApiKey = "AIzaSyAJutq3-R2lmQCtnRlFj-uB9cQG3lAWGLM";
      let embedUrl = '';
      
      // Format 1: https://maps.app.goo.gl/...
      if (shareLink.includes('maps.app.goo.gl')) {
        // For short URLs, we'll use the place parameter
        const placeId = shareLink.split('/').pop(); // Get the last part of the URL
        embedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Brejo do Cruz, PB, Brazil`;
      }
      // Format 2: https://www.google.com/maps/place/...
      else if (shareLink.includes('google.com/maps')) {
        // Extract coordinates from the URL
        const coordsMatch = shareLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordsMatch) {
          const [_, lat, lng] = coordsMatch;
          embedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${lat},${lng}`;
        } else {
          // If no coordinates found, use the location name
          embedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Brejo do Cruz, PB, Brazil`;
        }
      }

      // If we have a valid embed URL, return it
      if (embedUrl) {
        console.log('Generated embed URL:', embedUrl); // For debugging
        return embedUrl;
      }
      
      // If no valid URL was generated, return the default location
      return `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Brejo do Cruz, PB, Brazil`;
    } catch (error) {
      console.error('Error converting map link:', error);
      // Return default location on error
      return `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Brejo do Cruz, PB, Brazil`;
    }
  };

  return (
    <Container className="col-lg-8">
      <h2 className="fs-5 fw-bold mb-4">Create new cultural space</h2>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Project type *</Form.Label>
          <Form.Select className="rounded-3 py-2 border-dark" >
            <option>Select</option>
            <option>MOSTRA</option>
            <option>FESTIVAL</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Project name *</Form.Label>
          <Form.Control type="text" className="rounded-3 py-2 border-dark"  />
        </Form.Group>

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Group>
            <Form.Label className="d-flex align-items-center gap-2 fs-6">
              <FaRegListAlt />
              <span >Description *</span>
            </Form.Label>
            <div
              className="border-1  rounded-3 p-3"
              style={{ borderColor: '#ced4da', minHeight: '100px' }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Form.Group>
          <Button className="w-100 text-dark rounded-5 mt-2" style={{ backgroundColor: '#fff', borderColor: '#8BC34A' }} onClick={() => {
              setTempDescription(description);
              setShowDescriptionModal(true);
          }}>Edit</Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Capacity of people in space *</Form.Label>
          <Form.Control type="text" className="rounded-3 py-2 border-dark"  />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Opening and closing hours *</Form.Label>
          <Form.Control type="text" className="rounded-3 py-2 border-dark"  />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fs-6">Operating days *</Form.Label>
          <Form.Control type="text" className="rounded-3 py-2 border-dark"  />
        </Form.Group>

        <div className=" rounded-3  p-2 my-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Cover</span>
          </Form.Label>
          <div className="d-flex gap-2 p-3  flex-wrap  rounded-3">
            {coverPhoto ? (
              <div className="position-relative" style={{ width: "100%", height: 200 }}>
                <Image src={coverPhoto} alt="Cover" className="w-100 h-100 rounded-3 object-fit-cover" width={500} height={200} />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-1 text-dark"
                  onClick={() => setCoverPhoto(null)}
                >
                  <FaTimes />
                </Button>
              </div>
            ) : (
              <label className="  d-flex align-items-center  w-100 justify-content-center  rounded-3"
                style={{ height: "200px", cursor: 'pointer', backgroundColor: 'rgba(22, 51, 0, 0.08)', color: '#fff' }}>
                <input type="file" hidden onChange={handleCoverPhotoAdd} accept="image/*" />
                <div className="text-center text-dark ">
                  <div className="rounded-circle border  bg-white p-2 mx-auto mb-1" style={{ width: 'fit-content', height: '44px', width: '44px' }}>
                    <span>+</span>
                  </div>
                  <small>Novo</small>
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="rounded-3 p-3 mb-3" >
          <h6 className="mb-3">Project links</h6>
          {Object.entries(socialLinks).map(([platform, { enabled, url }]) => (
            <div key={platform} className="mb-2">
              <div className="d-flex border-dark  justify-content-between align-items-center p-2 rounded-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
                <div className="d-flex align-items-center  gap-2">
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

        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <div className="d-flex justify-content-between align-items-center" onClick={() => setAccessibilityOpen(!accessibilityOpen)} style={{ cursor: 'pointer' }}>
            <h6 className="mb-0">Physical Accessibility</h6>
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                {accessibilityOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
          {accessibilityOpen && (
            <div className="p-3">
              <Form.Check type="checkbox" id="adaptedToilets" name="adaptedToilets" label="Banheiros adaptados" onChange={handleAccessibilityChange} checked={physicalAccessibility.adaptedToilets} className="mb-2" />
              <Form.Check type="checkbox" id="accessRamp" name="accessRamp" label="Rampa de acesso" onChange={handleAccessibilityChange} checked={physicalAccessibility.accessRamp} className="mb-2" />
              <Form.Check type="checkbox" id="elevator" name="elevator" label="Elevador" onChange={handleAccessibilityChange} checked={physicalAccessibility.elevator} className="mb-2" />
              <Form.Check type="checkbox" id="tactileSignaling" name="tactileSignaling" label="Sinalização tátil" onChange={handleAccessibilityChange} checked={physicalAccessibility.tactileSignaling} className="mb-2" />
              <Form.Check type="checkbox" id="adaptedDrinkingFountain" name="adaptedDrinkingFountain" label="Bebedouro adaptado" onChange={handleAccessibilityChange} checked={physicalAccessibility.adaptedDrinkingFountain} className="mb-2" />
              <Form.Check type="checkbox" id="handrail" name="handrail" label="Corrimão nas escadas e rampas" onChange={handleAccessibilityChange} checked={physicalAccessibility.handrail} className="mb-2" />
              <Form.Check type="checkbox" id="adaptedElevator" name="adaptedElevator" label="Elevador adaptado" onChange={handleAccessibilityChange} checked={physicalAccessibility.adaptedElevator} className="mb-2" />
            </div>
          )}
        </div>

        <div className=" rounded-3 p-3 mb-4" style={{ backgroundColor: 'rgba(22, 51, 0, 0.08)' }}>
          <Form.Label className="d-flex align-items-center gap-2 mb-3">
            <FaCamera className="text-secondary" />
            <span>Photo gallery</span>
          </Form.Label>
          <div className="d-flex gap-2 flex-wrap">
            {photos.map((photo, index) => (
              <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
                <Image src={photo} alt="" width={100} height={100} className="w-100 h-100 rounded-3 object-fit-cover" />
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
                <div className="rounded-circle  p-2 mx-auto mb-1" style={{ width: 'fit-content' }}>
                  <span>+</span>
                </div>
                <small>Novo</small>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-1">Brejo do Cruz/PB - CEP: 58890000</p>
          {mapLink ? (
            <div>
              <iframe
                src={mapLink}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3"
              ></iframe>
              <Button 
                variant="link" 
                className="p-0 mt-2 text-muted"
                onClick={() => setShowMapModal(true)}
              >
                Change location
              </Button>
            </div>
          ) : (
            <div
              style={{ height: '200px', backgroundColor: '#e9ecef', cursor: 'pointer' }}
              className="d-flex align-items-center justify-content-center rounded-3"
              onClick={() => setShowMapModal(true)}
            >
              <p className="text-muted">Click to add location</p>
            </div>
          )}
        </div>

        <Button variant="success" className="w-100 py-2 rounded-3" style={{ backgroundColor: '#8BC34A', borderColor: '#8BC34A' }}>
          Create Space
        </Button>
      </Form>

      <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32, backgroundColor: 'rgba(0,0,0,0.05)'}}>
              <FaRegListAlt />
            </div>
            <Modal.Title as="h6">Description *</Modal.Title>
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
            Save answer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMapModal} onHide={() => setShowMapModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h6">Add Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Google Maps Share Link</Form.Label>
            <Form.Control
              type="url"
              value={tempMapLink}
              onChange={(e) => {
                const newLink = e.target.value;
                setTempMapLink(newLink);
                const embedUrl = convertShareLinkToEmbed(newLink);
                console.log('Setting map link to:', embedUrl); // For debugging
                setMapLink(embedUrl);
              }}
              placeholder="Paste Google Maps share link here"
            />
            <Form.Text muted>
              Go to Google Maps, find a location, click &quot;Share&quot;, and paste the link here.
            </Form.Text>
          </Form.Group>
          {mapLink && (
            <div className="mt-3">
              <h6>Preview:</h6>
              <iframe
                src={mapLink}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3"
              ></iframe>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMapModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowMapModal(false);
          }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default NewSpaceForm; 