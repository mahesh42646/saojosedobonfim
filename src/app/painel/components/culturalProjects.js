"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { buildApiUrl } from '../../config/api';
// import 'leaflet/dist/leaflet.css';

const spaces = [

  { name: "Projec 1", subtitle: "User 33", color: "#3B5998", type: "CENTRO", status: "approved" },
];

function SpaceDetails({ space, onBack, fetchProjectDetails }) {
  const [tab, setTab] = useState("update");

  // Add function to handle status updates
  const handleStatusUpdate = async (newStatus) => {
    // Show confirmation dialog
    const action = newStatus === 'inativar' ? 'inativar' :
                  newStatus === 'rejected' ? 'rejeitar' :
                  'aprovar';
                  
    const confirmed = window.confirm(`Tem certeza que deseja ${action === 'inativar' ? 'inativar' : 
                                                         action === 'rejeitar' ? 'rejeitar' : 
                                                         'aprovar'} este projeto?`);
    
    if (!confirmed) return;

    try {
      const statusResponse = await fetch(buildApiUrl(`/admin/project/${space._id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.error || 'Failed to update project status');
      }

      const data = await statusResponse.json();
      
      // Show success message
      alert(data.message || `Projeto ${action === 'inativar' ? 'inativado' : 
                                action === 'rejeitar' ? 'rejeitado' : 
                                'aprovado'} com sucesso!`);
      
      // Fetch updated project details
      await fetchProjectDetails(space._id);
      
    } catch (error) {
      console.error('Error updating project status:', error);
      alert(error.message || 'Failed to update project status. Please try again.');
    }
  };

  const handleViewPublic = () => {
    window.location.href = `/public/projetos?id=${space._id}`;
  };

  return (
    <div className="ps-2">

      <h4 className=" mt-3  fw-bold">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 16 }}>←</button>
        Detalhes do Projeto Cultural</h4>

      <div style={{ maxWidth: 874, margin: '0 auto', background: '#fff', borderRadius: 16, border: '2px solid #eee', padding: 0 }}>
        <div style={{ backgroundColor: '#f7f7f7', padding: 14, borderBottom: '1px solid #eee', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: space.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 32 }}><i className="bi bi-building"></i></span>
            </div>
            <div >
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
                {space.status === 'approved' ? 'Projeto aprovado e publicado' : 
                 space.status === 'pending' ? 'Projeto pendente de aprovação' :
                 space.status === 'inactive' ? 'Projeto inativo' : 
                 'Projeto rejeitado'}
              </div>
            </div>
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
        {/* Timeline/History */}
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
                    {new Date(space.createdAt).toLocaleDateString('PT-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style={{ color: '#222', fontSize: 15 }}>Projeto criado com sucesso</div>
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
                      {new Date(history.changedAt).toLocaleDateString('PT-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>
                      {history.status === 'approved' ? 'Projeto aprovado e publicado' :
                       history.status === 'rejected' ? 'Projeto rejeitado' :
                       history.status === 'inactive' ? 'Projeto definido como inativo' :
                       'Status do projeto atualizado'}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ minWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <input 
                  value={space.status === 'approved' ? 'Projeto aprovado e publicado' : 
                         space.status === 'rejected' ? 'Projeto rejeitado' :
                         space.status === 'inactive' ? 'Projeto inativo' :
                         'Projeto aguardando aprovação'} 
                  readOnly 
                  style={{ width: '100%', padding: 12, borderRadius: 24, border: '2px solid #eee', fontSize: 15 }} 
                />
              </div>
            </div>
          </div>
        )}
        {tab === 'details' && (
          <form style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: '#fff' }}>
            {/* Project type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Tipo de projeto *</label>
              <select 
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                value={space.type}
                disabled
              >
                <option value="MOSTRA">MOSTRA</option>
                <option value="FESTIVAL">FESTIVAL</option>
              </select>
            </div>
            {/* Project name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Título do projeto *</label>
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
              <div 
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: '1px solid #ccc', 
                  fontSize: 12, 
                  minHeight: 80, 
                  background: '#F7F7F7',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {space.description || 'Sem conteúdo'}
              </div>
            </div>
            {/* Period */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Período do Projeto *</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 14, marginBottom: 4, display: 'block' }}>Data de Início</label>
                  <input 
                    type="text"
                    value={space.period?.start ? new Date(space.period.start).toLocaleDateString() : ''}
                    readOnly
                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 14, marginBottom: 4, display: 'block' }}>Data de Fim</label>
                  <input 
                    type="text"
                    value={space.period?.end ? new Date(space.period.end).toLocaleDateString() : ''}
                    readOnly
                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} 
                  />
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Links Sociais</div>
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
            {/* Photo gallery */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Galeria de fotos</div>
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
            {/* Map section */}
            <section style={{
              background: "#fff",
              color: "#111",
              borderRadius: 10,
              margin: "",
              maxWidth: 1499,
              padding: 0,
              marginBottom: 0
            }}>
              <div style={{ padding: "0 0px" }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <i className="bi bi-geo-alt" style={{ color: '#222', fontSize: 18 }}></i>
                  <span style={{ fontSize: 15 }}>Brejo do Cruz/PB - 58890-000</span>
                </div>
                <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                  <iframe
                    title="Pedra da Turmalina Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-37.507%2C-6.350%2C-37.497%2C-6.340&amp;layer=mapnik"
                    style={{ width: '100%', height: 300, border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
              <div style={{ textAlign: "left", margin: "20px 0 30px 30px", fontSize: 14 }}>
                This is the public page of the Cultural Project, which can be accessed by anyone. Example of a link in the system <br />
                <a href="(https://mapadacultura.com/public/espacosculturais/999)" style={{ color: "#4af", textDecoration: "underline" }}>
                  (https://mapadacultura.com/public/espacosculturais/999)
                </a>
              </div>
            </section>
          </form>
        )}
        {/* Action Buttons */}
        <div className="me-5" style={{ display: 'flex', justifyContent: 'end', gap: 24, padding: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <button 
            onClick={handleViewPublic}
            style={{ 
              background: '#F7f7f7',
              color: '#000', 
              border: 'none', 
              borderRadius: 24, 
              padding: '6px 48px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer'
            }}
          >
            Ver Página Pública
          </button>
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsResponse = await fetch(buildApiUrl('/admin/projects'));

      if (!projectsResponse.ok) {
        const errorData = await projectsResponse.json();
        throw new Error(errorData.error || `HTTP error! status: ${projectsResponse.status}`);
      }

      const data = await projectsResponse.json();
      setProjects(data || []); 
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch project details
  const fetchProjectDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const detailsResponse = await fetch(buildApiUrl(`/admin/project/${id}`));

      if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json();
        throw new Error(errorData.error || `HTTP error! status: ${detailsResponse.status}`);
      }

      const data = await detailsResponse.json();
      setSelectedSpace(data);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError(err.message || 'Failed to load project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      fetchProjects();
    } else {
      const filtered = projects.filter(project => 
        project.name?.toLowerCase().includes(term.toLowerCase()) ||
        project.type?.toLowerCase().includes(term.toLowerCase())
      );
      setProjects(filtered);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-2" >
      {selectedSpace ? (
        <SpaceDetails 
          space={selectedSpace} 
          onBack={() => setSelectedSpace(null)} 
          fetchProjectDetails={fetchProjectDetails}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>Lista de Projetos Culturais</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Buscar Projeto"
                value={searchTerm}
                onChange={handleSearch}
                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Carregando projetos...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
              {error}
              <br />
              <button 
                onClick={() => fetchProjects()} 
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
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'Nenhum projeto encontrado para sua busca.' : 'Nenhum projeto encontrado.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projects.map((project, idx) => (
                <div
                  key={project._id || idx}
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
                  onClick={() => fetchProjectDetails(project._id)}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {project.coverPhoto ? (
                      <Image 
                        src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${project.coverPhoto}`}
                        alt={project.title}
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
                    <div style={{ fontWeight: 500, fontSize: 16 }}>{project.title}</div>
                    <div style={{ color: '#888', fontSize: 15 }}>{project.type}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      {project.period?.start && `De: ${new Date(project.period.start).toLocaleDateString()}`}
                      {project.period?.end && ` Até: ${new Date(project.period.end).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: project.status === 'approved' ? '#2F5711' : project.status === 'rejected' ? '#ff4444' : '#888' }}>
                    {project.status === 'approved' ? (
                      <span style={{ fontSize: 18 }}><i className="bi bi-check-circle-fill"></i></span>
                    ) : project.status === 'rejected' ? (
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
