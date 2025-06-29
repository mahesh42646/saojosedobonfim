"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
// import 'leaflet/dist/leaflet.css';
import { buildApiUrl } from '../../config/api';
import NewSpaceForm from '../../agent/painel/components/new-Space-form';

const spaces = [

  { name: "Espac 3", subtitle: "Prefeitura Municipal", color: "#3B5998", type: "CENTRO", status: "approved" },
];

function SpaceDetails({ space, onBack, fetchSpaceDetails }) {
  const [tab, setTab] = useState("update");

  const handleViewPublic = () => {
    window.location.href = `/brejodocruz-pb/espacos?id=${space._id}`;
  };

  // Add function to handle status updates
  const handleStatusUpdate = async (newStatus) => {
    // Show confirmation dialog
    const action = newStatus === 'inactive' ? 'inactivate' :
                  newStatus === 'rejected' ? 'reject' :
                  'approve';
                  
    const confirmed = window.confirm(`Are you sure you want to ${action} this space?`);
    
    if (!confirmed) return;

    try {
      const statusResponse = await fetch(buildApiUrl(`/admin/space/${space._id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.error || 'Failed to update space status');
      }

      const data = await statusResponse.json();
      
      // Show success message
      alert(data.message || `Space ${action}d successfully!`);
      
      // Fetch updated space details
      await fetchSpaceDetails(space._id);
      
    } catch (error) {
      console.error('Error updating space status:', error);
      alert(error.message || 'Failed to update space status. Please try again.');
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
                  src={`http://localhost:4000/uploads/${space.coverPhoto}`}
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
              View Public Page <i className="bi bi-box-arrow-up-right"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingLeft: 24, gap: 32, marginTop: 0 }}>
          <div onClick={() => setTab('update')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'update' ? '2px solid #2F5711' : 'none', color: tab === 'update' ? '#2F5711' : '#222', fontWeight: tab === 'update' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Update
          </div>
          <div onClick={() => setTab('details')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'details' ? '2px solid #2F5711' : 'none', color: tab === 'details' ? '#2F5711' : '#222', fontWeight: tab === 'details' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Details
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
                       history.status === 'rejected' ? 'Espaço rejeitado' :
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
            {/* Space type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Tipo de espaço *</label>
              <select
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                value={space.type}
                disabled
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
                value={space.title || ''}
                readOnly
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F2F5F2', borderRadius: 8, padding: '8px 12px', gap: 8 }}>
                <span style={{ color: '#2F5711', fontSize: 20 }}><i className="bi bi-card-text"></i></span>
                <span style={{ fontWeight: 500 }}>Descrição *</span>
              </div>
              <textarea
                value={space.description || ''}
                readOnly
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 80, background: '#F7F7F7' }}
              />
            </div>

            {/* Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Capacidade *</label>
              <input
                value={space.capacity || ''}
                readOnly
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Operating Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Horário de funcionamento *</label>
              <input
                value={space.operatingHours || ''}
                readOnly
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Operating Days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Operating Days *</label>
              <input
                value={space.operatingDays || ''}
                readOnly
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
            </div>

            {/* Social Links */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Social Links</div>
              {/* Facebook */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-facebook"></i></span>
                <input
                  value={space.socialLinks?.facebook || ''}
                  readOnly
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }}
                />
              </div>
              {/* Instagram */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-instagram"></i></span>
                <input
                  value={space.socialLinks?.instagram || ''}
                  readOnly
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }}
                />
              </div>
              {/* YouTube */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-youtube"></i></span>
                <input
                  value={space.socialLinks?.youtube || ''}
                  readOnly
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
                  <input type="checkbox" checked={space.accessibility?.adaptedToilets} disabled /> Banheiros adaptados
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.accessRamp} disabled /> Rampa de acesso
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.elevator} disabled /> Elevador
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.tactileSignaling} disabled /> Sinalização tátil
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.adaptedDrinkingFountain} disabled /> Bebedouro adaptado
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.handrail} disabled /> Corrimão nas escadas e rampas
                </label>
                <label>
                  <input type="checkbox" checked={space.accessibility?.adaptedElevator} disabled /> Elevador adaptado
                </label>
              </div>
            </div>

            {/* Photo gallery */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Photo gallery</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {/* Cover Photo */}
                {space.coverPhoto && (
                  <div style={{ width: 160, height: 170, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={`http://localhost:4000/uploads/${space.coverPhoto}`}
                      alt="Cover"
                      width={160}
                      height={170}
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', fontSize: 12 }}>
                      Cover Photo
                    </div>
                  </div>
                )}
                {/* Additional Photos */}
                {space.photos?.map((photo, index) => (
                  <div key={index} style={{ width: 160, height: 170, borderRadius: 12, overflow: 'hidden' }}>
                    <Image
                      src={`http://localhost:4000/uploads/${photo}`}
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
            Rejeitar
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

      const response = await fetch(buildApiUrl('/admin/spaces'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSpaces(data || []);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Failed to load spaces. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch space details
  const fetchSpaceDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildApiUrl(`/admin/space/${id}`), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedSpace(data);
    } catch (err) {
      console.error('Error fetching space details:', err);
      setError('Failed to load space details. Please try again.');
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
        <NewSpaceForm onClose={() => setShowCreate(false)} onSuccess={handleSpaceCreated} />
      ) : selectedSpace ? (
        <SpaceDetails space={selectedSpace} onBack={() => setSelectedSpace(null)} fetchSpaceDetails={fetchSpaceDetails} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>List of Cultural Spaces</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Search space"
                value={searchTerm}
                onChange={handleSearch}
                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
              />
              <button
                onClick={() => setShowCreate(true)}
                style={{ background: '#7CFC00', border: 'none', borderRadius: 24, padding: '8px 24px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
              >
                New Culture
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
              {searchTerm ? 'No spaces found matching your search.' : 'No spaces found.'}
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
                        src={`http://localhost:4000/uploads/${space.coverPhoto}`}
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
