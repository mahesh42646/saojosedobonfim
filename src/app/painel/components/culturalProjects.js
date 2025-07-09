"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { buildApiUrl } from '../../config/api';
import NewProjectForm from '../../agent/painel/components/new-project-form';
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

  // Add function to handle project deletion
  const handleDeleteProject = async () => {
    const confirmed = window.confirm('Tem certeza que deseja DELETAR este projeto? Esta ação não pode ser desfeita!');

    if (!confirmed) return;

    // Second confirmation for safety
    const doubleConfirmed = window.confirm('ATENÇÃO: Você está prestes a deletar permanentemente este projeto. Confirma?');

    if (!doubleConfirmed) return;

    try {
      const deleteResponse = await fetch(buildApiUrl(`/admin/project/${space._id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      const data = await deleteResponse.json();

      // Show success message
      alert(data.message || 'Projeto deletado com sucesso!');

      // Go back to projects list
      onBack();

    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error.message || 'Failed to delete project. Please try again.');
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: space.color || '#3B5998', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {space.coverPhoto ? (
                  <Image
                    src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}`}
                    alt={space.title}
                    width={56}
                    height={56}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ color: '#fff', fontSize: 28 }}><i className="bi bi-calendar-event"></i></span>
                )}
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
            <button onClick={handleViewPublic} style={{ background: '#F7f7f7', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}           >             Ver Página Pública           </button>
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
          <div style={{ padding: 32 }}>
            <NewProjectForm
              isEditing={true}
              projectData={space}
              onClose={() => setTab('update')}
              onSuccess={() => {
                fetchProjectDetails(space._id);
                setTab('update');
              }}
            />
          </div>
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
          <button 
            onClick={handleDeleteProject}
            style={{ 
              background: '#ff4444',
              color: '#fff', 
              border: 'none', 
              borderRadius: 24, 
              padding: '6px 48px', 
              fontWeight: 600, 
              fontSize: 16, 
              cursor: 'pointer'
            }}
          >
            Deletar
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
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

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
      ) : showNewProjectForm ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <button
              onClick={() => setShowNewProjectForm(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#222',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                marginRight: 16
              }}
            >
              ←
            </button>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>Novo Projeto Cultural</h2>
          </div>
          <NewProjectForm
            onClose={() => setShowNewProjectForm(false)}
            onSuccess={() => {
              setShowNewProjectForm(false);
              fetchProjects(); // Refresh the projects list
            }}
          />
        </div>
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
            <button
              className="btn "
              style={{ background: '#7bfa02',  border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              onClick={() => setShowNewProjectForm(true)}
            >
              Adicionar Projeto
            </button>
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
                      <span style={{ color: '#fff', fontSize: 20, background: '#3B5998', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-calendar-event"></i>
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
