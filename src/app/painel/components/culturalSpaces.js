"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
// import 'leaflet/dist/leaflet.css';
import { buildApiUrl } from '../../config/api';
import { useAuth as useAdminAuth } from '../authContex';

// Import the agent's auth context components
import { AuthProvider as AgentAuthProvider, useAuth as useAgentAuth } from '../../agent/painel/authcontex';
import NewSpaceFormComponent from '../../agent/painel/components/new-Space-form';
import RichTextEditor from '../../agent/painel/components/RichTextEditor';

// Wrapper component that adapts admin auth to agent auth interface
function NewSpaceFormWrapper({ onClose, onSuccess }) {
  const adminAuth = useAdminAuth();
  
  // Store agent token in localStorage temporarily for the form
  React.useEffect(() => {
    if (adminAuth.token && adminAuth.user) {
      // Create a mock user object that matches what the agent auth expects
      const agentUser = {
        cpf: 'admin', // Default value since admin doesn't have CPF
        email: adminAuth.user.email || 'admin@system.com',
        name: adminAuth.user.name || 'Admin'
      };
      
      localStorage.setItem('agentToken', adminAuth.token);
      localStorage.setItem('agentUser', JSON.stringify(agentUser));
    }
    
    // Cleanup on unmount
    return () => {
      // Don't remove agent tokens as they might be used by actual agent users
    };
  }, [adminAuth.token, adminAuth.user]);

  return (
    <AgentAuthProvider>
      <NewSpaceFormComponent onClose={onClose} onSuccess={onSuccess} />
    </AgentAuthProvider>
  );
}

const spaces = [

  { name: "Espac 3", subtitle: "Prefeitura Municipal", color: "#3B5998", type: "CENTRO", status: "approved" },
];

function SpaceDetails({ space, onBack, fetchSpaceDetails }) {
  const [tab, setTab] = useState("update");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    type: space.type || '',
    title: space.title || '',
    description: space.description || '',
    capacity: space.capacity || '',
    operatingHours: space.operatingHours || '',
    operatingDays: space.operatingDays || '',
    socialLinks: {
      facebook: space.socialLinks?.facebook || '',
      instagram: space.socialLinks?.instagram || '',
      youtube: space.socialLinks?.youtube || ''
    },
    accessibility: {
      adaptedToilets: space.accessibility?.adaptedToilets || false,
      accessRamp: space.accessibility?.accessRamp || false,
      elevator: space.accessibility?.elevator || false,
      tactileSignaling: space.accessibility?.tactileSignaling || false,
      adaptedDrinkingFountain: space.accessibility?.adaptedDrinkingFountain || false,
      handrail: space.accessibility?.handrail || false,
      adaptedElevator: space.accessibility?.adaptedElevator || false,
    }
  });
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [tempDescription, setTempDescription] = useState(editData.description);
  const [loading, setLoading] = useState(false);

  const handleViewPublic = () => {
    window.location.href = `/public/espacos?id=${space._id}`;
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform, value) => {
    setEditData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // Handle accessibility changes
  const handleAccessibilityChange = (e) => {
    const { name, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [name]: checked
      }
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/admin/space/${space._id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update space');
      }

      const data = await response.json();
      alert('Espaço atualizado com sucesso!');
      setIsEditing(false);
      await fetchSpaceDetails(space._id);
      
    } catch (error) {
      console.error('Error updating space:', error);
      alert(error.message || 'Falha ao atualizar espaço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle status updates
  const handleStatusUpdate = async (newStatus) => {
    // Show confirmation dialog
    const action = newStatus === 'inactive' ? 'inativar' :
                  newStatus === 'rejected' ? 'Excluir' :
                  'aprovar';
                  
    const confirmed = window.confirm(`Tem certeza que deseja ${action} este espaço?`);
    
    if (!confirmed) return;

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

      const statusResponse = await fetch(buildApiUrl(`/admin/space/${space._id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.error || 'Failed to update space status');
      }

      const data = await statusResponse.json();
      
      // Show success message
      alert(data.message || `Espaço ${action === 'inativar' ? 'inativado' : action === 'rejeitar' ? 'rejeitado' : 'aprovado'} com sucesso!`);
      
      // Fetch updated space details
      await fetchSpaceDetails(space._id);
      
    } catch (error) {
      console.error('Error updating space status:', error);
      alert(error.message || 'Falha ao atualizar status do espaço. Tente novamente.');
    }
  };

  return (
    <div className="ps-2">
      <h4 className="mt-3 fw-bold">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 16 }}>←</button>
        Detalhes do Espaço Cultural
      </h4>

      <div style={{ maxWidth: 874, margin: '0 auto', background: '#fff', borderRadius: 16, border: '2px solid #eee', padding: 0 }}>
        <div style={{ backgroundColor: '#f7f7f7', padding: 14, borderBottom: '1px solid #eee', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {space.coverPhoto ? (
                <Image
                  src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}`}
                  alt={space.title}
                  width={56}
                  height={56}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span style={{ color: '#fff', fontSize: 32, background: '#3B5998', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bi bi-building"></i>
                </span>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: 20 }}>{space.title}</div>
              <div style={{ color: '#222', fontSize: 15, fontWeight: 500 }}>TIPO: {space.type}</div>
              <div style={{ fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ 
                  color: space.status === 'approved' ? '#2F5711' : 
                         space.status === 'rejected' ? '#ff4444' :
                         space.status === 'inactive' ? '#888' : '#2F5711',
                  fontSize: 18 
                }}>
                  {space.status === 'approved' ? <i className="bi bi-check-circle-fill"></i> :
                   space.status === 'rejected' ? <i className="bi bi-x-circle-fill"></i> :
                   space.status === 'inactive' ? <i className="bi bi-dash-circle-fill"></i> :
                   <i className="bi bi-clock"></i>}
                </span>
                {space.status === 'approved' ? 'Espaço aprovado e publicado' : 
                 space.status === 'pending' ? 'Espaço aguardando aprovação' :
                 space.status === 'inactive' ? 'Espaço inativo' : 
                 'Espaço rejeitado'}
              </div>
            </div>
            <button 
              onClick={handleViewPublic}
              className="btn ms-auto btn-light border"
              style={{ background: '#F5FFF0', color: '#222', border: '1px solid rgb(216, 251, 216)', borderRadius: 16, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Ver Página Pública <i className="bi bi-box-arrow-up-right"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingLeft: 24, gap: 32, marginTop: 0 }}>
          <div onClick={() => setTab('update')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'update' ? '2px solid #2F5711' : 'none', color: tab === 'update' ? '#2F5711' : '#222', fontWeight: tab === 'update' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Atualizar
          </div>
          <div onClick={() => setTab('details')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'details' ? '2px solid #2F5711' : 'none', color: tab === 'details' ? '#2F5711' : '#222', fontWeight: tab === 'details' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Detalhes
          </div>
        </div>

        {tab === 'update' && (
          <div style={{ padding: 32, paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 24 }}>
              <div style={{ minWidth: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44 }}>
                  <span style={{ color: '#2ecc40', fontSize: 22 }}>
                    <i className="bi bi-plus-circle-fill"></i>
                  </span>
                </div>
                {space.statusHistory?.map((history, index) => (
                  <div className="mt-1" key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 41 }}>
                    <span style={{ 
                      color: history.status === 'approved' ? '#2ecc40' : 
                             history.status === 'rejected' ? '#ff4444' :
                             history.status === 'inactive' ? '#888' : '#2ecc40',
                      fontSize: 22,
                      lineHeight: 1 
                    }}>
                      {history.status === 'approved' ? <i className="bi bi-check-circle-fill"></i> :
                       history.status === 'rejected' ? <i className="bi bi-x-circle-fill"></i> :
                       history.status === 'inactive' ? <i className="bi bi-dash-circle-fill"></i> :
                       <i className="bi bi-clock"></i>}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 24, minHeight: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: '#888', fontSize: 15 }}>
                    {new Date(space.createdAt).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style={{ color: '#222', fontSize: 15 }}>Espaço criado com sucesso</div>
                </div>
                {space.statusHistory?.map((history, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < space.statusHistory.length - 1 ? 24 : 0,
                    minHeight: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{ color: '#888', fontSize: 15 }}>
                      {new Date(history.changedAt).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>
                      {history.status === 'approved' ? 'Espaço aprovado e publicado' :
                       history.status === 'rejected' ? 'Espaço Excluir' :
                       history.status === 'inactive' ? 'Espaço definido como inativo' :
                       'Status do espaço atualizado'}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ minWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <input 
                  value={space.status === 'approved' ? 'Espaço aprovado e publicado' : 
                         space.status === 'rejected' ? 'Espaço rejeitado' :
                         space.status === 'inactive' ? 'Espaço inativo' :
                         'Espaço aguardando aprovação'} 
                  readOnly 
                  style={{ width: '100%', padding: 12, borderRadius: 24, border: '2px solid #eee', fontSize: 15 }} 
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'details' && (
          <form style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: '#fff' }}>
            {/* Edit/Save buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Detalhes do Espaço</h5>
              <div style={{ display: 'flex', gap: 12 }}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: '#2F5711',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          type: space.type || '',
                          title: space.title || '',
                          description: space.description || '',
                          capacity: space.capacity || '',
                          operatingHours: space.operatingHours || '',
                          operatingDays: space.operatingDays || '',
                          socialLinks: {
                            facebook: space.socialLinks?.facebook || '',
                            instagram: space.socialLinks?.instagram || '',
                            youtube: space.socialLinks?.youtube || ''
                          },
                          accessibility: {
                            adaptedToilets: space.accessibility?.adaptedToilets || false,
                            accessRamp: space.accessibility?.accessRamp || false,
                            elevator: space.accessibility?.elevator || false,
                            tactileSignaling: space.accessibility?.tactileSignaling || false,
                            adaptedDrinkingFountain: space.accessibility?.adaptedDrinkingFountain || false,
                            handrail: space.accessibility?.handrail || false,
                            adaptedElevator: space.accessibility?.adaptedElevator || false,
                          }
                        });
                      }}
                      style={{
                        background: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={loading}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Space type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Tipo de espaço *</label>
              <select
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                value={isEditing ? editData.type : space.type}
                disabled={!isEditing}
                name="type"
                onChange={handleInputChange}
              >
                <option value="MOSTRA">MOSTRA</option>
                <option value="FESTIVAL">FESTIVAL</option>
                <option value="ATELIÊ">ATELIÊ</option>
                <option value="BIBLIOTECA">BIBLIOTECA</option>
                <option value="TEATRO">TEATRO</option>
                <option value="CINEMA">CINEMA</option>
                <option value="MUSEU">MUSEU</option>
                <option value="CENTRO_CULTURAL">CENTRO CULTURAL</option>
              </select>
            </div>

            {/* Space title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Título do espaço *</label>
              <input
                value={isEditing ? editData.title : (space.title || '')}
                readOnly={!isEditing}
                name="title"
                onChange={handleInputChange}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F2F5F2', borderRadius: 8, padding: '8px 12px', gap: 8 }}>
                <span style={{ color: '#2F5711', fontSize: 20 }}><i className="bi bi-card-text"></i></span>
                <span style={{ fontWeight: 500 }}>Descrição *</span>
              </div>
              {isEditing ? (
                <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
                  <RichTextEditor 
                    content={editData.description}
                    onChange={(html) => setEditData(prev => ({ ...prev, description: html }))}
                  />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: space.description || '' }}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: '1px solid #ccc', 
                    fontSize: 16, 
                    minHeight: 80, 
                    background: '#F7F7F7',
                    lineHeight: 1.5
                  }}
                />
              )}
            </div>

            {/* Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Capacidade *</label>
              <input
                value={isEditing ? editData.capacity : (space.capacity || '')}
                readOnly={!isEditing}
                name="capacity"
                onChange={handleInputChange}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Operating Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Horário de funcionamento *</label>
              <input
                value={isEditing ? editData.operatingHours : (space.operatingHours || '')}
                readOnly={!isEditing}
                name="operatingHours"
                onChange={handleInputChange}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Operating Days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Dias de funcionamento *</label>
              <input
                value={isEditing ? editData.operatingDays : (space.operatingDays || '')}
                readOnly={!isEditing}
                name="operatingDays"
                onChange={handleInputChange}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Social Links */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Links Sociais</div>
              {/* Facebook */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-facebook"></i></span>
                <input
                  value={isEditing ? editData.socialLinks.facebook : (space.socialLinks?.facebook || '')}
                  readOnly={!isEditing}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }}
                />
              </div>
              {/* Instagram */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-instagram"></i></span>
                <input
                  value={isEditing ? editData.socialLinks.instagram : (space.socialLinks?.instagram || '')}
                  readOnly={!isEditing}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }}
                />
              </div>
              {/* YouTube */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-youtube"></i></span>
                <input
                  value={isEditing ? editData.socialLinks.youtube : (space.socialLinks?.youtube || '')}
                  readOnly={!isEditing}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }}
                />
              </div>
            </div>

            {/* Physical Accessibility */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>Acessibilidade física</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <label>
                  <input 
                    type="checkbox" 
                    name="adaptedToilets"
                    checked={isEditing ? editData.accessibility.adaptedToilets : space.accessibility?.adaptedToilets} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Banheiros adaptados
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="accessRamp"
                    checked={isEditing ? editData.accessibility.accessRamp : space.accessibility?.accessRamp} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Rampa de acesso
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="elevator"
                    checked={isEditing ? editData.accessibility.elevator : space.accessibility?.elevator} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Elevador
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="tactileSignaling"
                    checked={isEditing ? editData.accessibility.tactileSignaling : space.accessibility?.tactileSignaling} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Sinalização tátil
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="adaptedDrinkingFountain"
                    checked={isEditing ? editData.accessibility.adaptedDrinkingFountain : space.accessibility?.adaptedDrinkingFountain} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Bebedouro adaptado
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="handrail"
                    checked={isEditing ? editData.accessibility.handrail : space.accessibility?.handrail} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Corrimão nas escadas e rampas
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="adaptedElevator"
                    checked={isEditing ? editData.accessibility.adaptedElevator : space.accessibility?.adaptedElevator} 
                    disabled={!isEditing}
                    onChange={handleAccessibilityChange}
                  /> Elevador adaptado
                </label>
              </div>
            </div>

            {/* Photo gallery */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Galeria de Fotos</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {/* Cover Photo */}
                {space.coverPhoto && (
                  <div style={{ width: 160, height: 170, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}`}
                      alt="Cover"
                      width={160}
                      height={170}
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', fontSize: 12 }}>
                      Foto de Capa
                    </div>
                  </div>
                )}
                {/* Additional Photos */}
                {space.photos?.map((photo, index) => (
                  <div key={index} style={{ width: 160, height: 170, borderRadius: 12, overflow: 'hidden' }}>
                    <Image
                      src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${photo}`}
                      alt={`Photo ${index + 1}`}
                      width={160}
                      height={170}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <section style={{ background: "#fff", color: "#111", borderRadius: 10, margin: "", maxWidth: 1499, padding: 0, marginBottom: 0 }}>
              <div style={{ padding: "0 0px" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <i className="bi bi-geo-alt" style={{ color: '#222', fontSize: 18 }}></i>
                  <span style={{ fontSize: 15 }}>
                    {space.location?.address}, {space.location?.city}/{space.location?.state} - CEP {space.location?.cep}
                  </span>
                </div>
                {space.location?.mapLink && (
                  <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                    <iframe
                      title={`${space.title} Map`}
                      src={space.location.mapLink}
                      style={{ width: '100%', height: 300, border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            </section>
          </form>
        )}

        {/* Action Buttons */}
        <div className="me-5" style={{ display: 'flex', justifyContent: 'end', gap: 24, padding: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <button 
            onClick={() => handleStatusUpdate('inactive')}
            style={{ 
              background: space.status === 'inactive' ? '#ddd' : '#F7f7f7',
              color: '#000', 
              border: 'none', 
              borderRadius: 24, 
              padding: '6px 48px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer',
              opacity: space.status === 'inactive' ? 0.7 : 1
            }}
            disabled={space.status === 'inactive'}
          >
            Inativo
          </button>
          <button 
            onClick={() => handleStatusUpdate('rejected')}
            style={{ 
              background: space.status === 'rejected' ? '#ffdddd' : '#F7f7f7',
              color: '#000', 
              border: 'none', 
              borderRadius: 24, 
              padding: '6px 48px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer',
              opacity: space.status === 'rejected' ? 0.7 : 1
            }}
            disabled={space.status === 'rejected'}
          >
            Excluir
          </button>
          <button 
            onClick={() => handleStatusUpdate('approved')}
            style={{ 
              background: space.status === 'approved' ? '#90EE90' : '#F7f7f7',
              color: '#000', 
              border: 'none', 
              borderRadius: 24, 
              padding: '6px 48px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer',
              opacity: space.status === 'approved' ? 0.7 : 1
            }}
            disabled={space.status === 'approved'}
          >
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CspacePage() {
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch spaces from API
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

      const response = await fetch(buildApiUrl('/admin/spaces'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSpaces(data || []);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Falha ao carregar espaços. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch space details
  const fetchSpaceDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

      const response = await fetch(buildApiUrl(`/admin/space/${id}`), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedSpace(data);
    } catch (err) {
      console.error('Error fetching space details:', err);
      setError('Falha ao carregar detalhes do espaço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      fetchSpaces();
    } else {
      const filtered = spaces.filter(space =>
        space.title?.toLowerCase().includes(term.toLowerCase()) ||
        space.type?.toLowerCase().includes(term.toLowerCase()) ||
        space.description?.toLowerCase().includes(term.toLowerCase())
      );
      setSpaces(filtered);
    }
  };

  // Handle successful space creation
  const handleSpaceCreated = () => {
    setShowCreate(false);
    fetchSpaces(); // Refresh the spaces list
  };

  // Fetch spaces on component mount
  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-2" >
      {showCreate ? (
        <NewSpaceFormWrapper onClose={() => setShowCreate(false)} onSuccess={handleSpaceCreated} />
      ) : selectedSpace ? (
        <SpaceDetails space={selectedSpace} onBack={() => setSelectedSpace(null)} fetchSpaceDetails={fetchSpaceDetails} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>Lista de Espaços Culturais</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <input
                type="text"
                placeholder="Buscar espaço"
                value={searchTerm}
                onChange={handleSearch}
                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
              />
                              <button
                onClick={() => setShowCreate(true)}
                style={{ background: '#7BFA02', border: 'none', borderRadius: 24, padding: '8px 24px', fontWeight: 600,  cursor: 'pointer' }}
              >
                Nova Cultura
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Carregando espaços...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
              {error}
              <br />
              <button
                onClick={() => fetchSpaces()}
                style={{
                  background: '#7CFC00',
                  border: 'none',
                  borderRadius: 16,
                  padding: '8px 16px',
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : spaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'Nenhum espaço encontrado correspondente à sua pesquisa.' : 'Nenhum espaço encontrado.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {spaces.map((space, idx) => (
                <div
                  key={space._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: 'transparent',
                    borderRadius: 20,
                    padding: '12px',
                    minHeight: 48,
                    cursor: 'pointer',
                    border: '1px solid #eee'
                  }}
                  onClick={() => fetchSpaceDetails(space._id)}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {space.coverPhoto ? (
                      <Image
                        src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}`}
                        alt={space.title}
                        width={48}
                        height={48}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ color: '#fff', fontSize: 22, background: '#3B5998', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-building"></i>
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 16 }}>{space.title}</div>
                    <div style={{ color: '#888', fontSize: 15 }}>{space.type}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      {space.location?.city}, {space.location?.state}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: space.status === 'approved' ? '#2F5711' : space.status === 'rejected' ? '#ff4444' : '#888' }}>
                    {space.status === 'approved' ? (
                      <span style={{ fontSize: 18 }}><i className="bi bi-check-circle-fill"></i></span>
                    ) : space.status === 'rejected' ? (
                      <span style={{ fontSize: 18 }}><i className="bi bi-x-circle-fill"></i></span>
                    ) : (
                      <span style={{ fontSize: 18 }}><i className="bi bi-clock"></i></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
