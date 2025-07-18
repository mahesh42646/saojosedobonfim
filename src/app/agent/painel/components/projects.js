"use client"
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import Image from 'next/image';
import { FaCheck, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import NewProjectForm from './new-project-form';
import { buildApiUrl } from '../../../config/api';

const ProjectStatus = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected'
};

const StatusIcon = ({ status }) => {
    switch (status) {
        case ProjectStatus.APPROVED:
            return <FaCheck className="text-success" />;
        case ProjectStatus.PENDING:
            return <FaExclamationCircle className="text-warning" />;
        case ProjectStatus.REJECTED:
            return <FaTimes className="text-danger" />;
        default:
            return null;
    }
};

const StatusText = ({ status }) => {
    switch (status) {
        case ProjectStatus.APPROVED:
            return 'Projeto aprovado e publicado';
        case ProjectStatus.PENDING:
            return 'Projeto pendente de aprovação';
        case ProjectStatus.REJECTED:
            return 'Projeto recusado';
        default:
            return '';
    }
};

const ProjectCard = ({ project }) => {
    const [imgError, setImgError] = useState(false);
    
    return (
        <div className={`d-flex align-items-center p-2 rounded-4 bg-secondary-lite ${project.status === ProjectStatus.PENDING ? 'bg-' : 'bg-'}`}
        style={{ border: '0.01px solid rgb(255, 255, 255)'}}>
            <Image
                src={!imgError && project.coverPhoto ? `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${project.coverPhoto}` : '/images/card.png'}
                alt={project.title}
                width={70}
                height={70}
                className="rounded-circle border-dark p-1"
                onError={() => setImgError(true)}
                priority={true}
            />
            <div className="ms-4 flex-grow-1">
                <p className="m-0 fw-bold" style={{ fontSize: 16 }}>{project.title}</p>
                <p className="m-0 text-secondary">TIPO: {project.type}</p>
                <div className="d-flex align-items-center gap-2">
                    <StatusIcon status={project.status} />
                    <span className="">{StatusText({ status: project.status })}</span>
                </div>
            </div>
        </div>
    );
};

const ProjectDetails = ({ project, onBack, onDelete }) => {
    const [activeTab, setActiveTab] = useState('updates');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('agentToken');
            const response = await fetch(buildApiUrl(`/project/${project._id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            });

            if (!response.ok) throw new Error('Failed to delete project');
            
            onDelete();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Falha ao excluir projeto. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Format the dates for updates
    const updates = [
        {
            date: new Date(project.createdAt).toLocaleString('PT-BR'),
            text: 'Projeto criado com sucesso',
            status: 'success'
        }
    ];

    if (project.status === 'approved') {
        updates.push({
            date: new Date(project.updatedAt).toLocaleString('PT-BR'),
            text: 'Projeto aprovado e publicado',
            status: 'approved'
        });
    }

    return (
        <Container className="pt-4">
            <div className="d-flex mb-3 align-items-center">
                <Button onClick={onBack} className="btn bg-light text-dark border-0">&larr;</Button>
                <h5 className="fw-bold m-0 ms-2">{project.title}</h5>
            </div>
            <div className="d-flex align-items-center p-2 rounded-4" style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <Image
                    src={project.coverPhoto ? `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${project.coverPhoto}` : '/images/card.png'}
                    alt={project.title}
                    width={70}
                    height={70}
                    className="rounded-circle"
                    style={{ border: '2px solid #e0e0e0' }}
                />
                <div className="ms-4 flex-grow-1">
                    <p className="m-0 fw-bold" style={{ fontSize: 16 }}>TIPO: {project.type}</p>
                    <div className="d-flex align-items-center gap-2">
                        <StatusIcon status={project.status} />
                        <span className="text-success">{StatusText({ status: project.status })}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Tabs 
                    activeKey={activeTab} 
                    onSelect={setActiveTab} 
                    className="mb-3"
                    style={{ borderBottom: '1px solid #dee2e6' }}
                >
                    <Tab eventKey="updates" title="Atualizações">
                        <div className="p-3">
                            <div className="d-flex align-items-start mb-4">
                                <div className="me-3">
                                    <div className="fw-bold" style={{ color: '#666' }}>
                                        {new Date(project.createdAt).toLocaleString('PT-BR')}
                                    </div>
                                    <div>Projeto criado com sucesso</div>
                                </div>
                            </div>
                            
                            {project.statusHistory && project.statusHistory.length > 0 ? (
                                project.statusHistory.map((statusUpdate, index) => (
                                    <div key={index} className="d-flex align-items-start mb-4">
                                        <div className="me-3">
                                            <div className="fw-bold" style={{ color: '#666' }}>
                                                {new Date(statusUpdate.changedAt).toLocaleString('PT-BR')}
                                            </div>
                                            <div className="fw-bold">
                                                {statusUpdate.status === 'approved' && 'Projeto aprovado e publicado'}
                                                {statusUpdate.status === 'rejected' && 'Projeto recusado'}
                                                {statusUpdate.status === 'pending' && 'Projeto em análise'}
                                                {statusUpdate.status === 'inactive' && 'Projeto inativo'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                project.status !== 'pending' && (
                                    <div className="d-flex align-items-start">
                                        <div className="me-3">
                                            <div className="fw-bold" style={{ color: '#666' }}>
                                                {new Date(project.updatedAt).toLocaleString('PT-BR')}
                                            </div>
                                            <div className="fw-bold">
                                                {project.status === 'approved' && 'Projeto aprovado e publicado'}
                                                {project.status === 'rejected' && 'Projeto recusado'}
                                                {project.status === 'inactive' && 'Projeto inativo'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="details" title="Detalhes">
                        <div className="p-3">
                            <div className="mb-4">
                                <div className="fw-bold mb-2">Descrição do Projeto</div>
                                <div className="d-flex align-items-start mb-4">
                                    <div className="me-3">
                                        <div className="fw-bold" style={{ color: '#666' }}>{project.title}</div>
                                        <div 
                                            style={{ color: '#666' }}
                                            dangerouslySetInnerHTML={{ __html: project.description }}
                                        />
                                    </div>
                                </div>
                                
                                {project.period && (
                                    <div className="mb-4">
                                        <div className="fw-bold mb-2">Período do Projeto</div>
                                        <div style={{ color: '#666' }}>
                                            <div>Início: {project.period.start ? new Date(project.period.start).toLocaleDateString('PT-BR') : 'Não definido'}</div>
                                            {project.period.end && (
                                                <div>Fim: {new Date(project.period.end).toLocaleDateString('PT-BR')}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {project.photos && project.photos.length > 0 && (
                                    <div className="mb-4">
                                        <div className="fw-bold mb-2">Galeria de Fotos</div>
                                        <div className="d-flex gap-3 flex-wrap">
                                            {project.photos.map((photo, index) => (
                                                <Image
                                                    key={index}
                                                    src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${photo}`}
                                                    alt={`Gallery photo ${index + 1}`}
                                                    width={150}
                                                    height={150}
                                                    className="rounded-3"
                                                    style={{ objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = '/images/card.png';
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.socialLinks && Object.keys(project.socialLinks).length > 0 && (
                                    <div className="mb-4">
                                        <div className="fw-bold mb-2">Links Sociais</div>
                                        <div style={{ color: '#666' }}>
                                            {project.socialLinks.instagram && (
                                                <div>
                                                    <strong>Instagram:</strong> 
                                                    <a href={project.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="ms-2">
                                                        {project.socialLinks.instagram}
                                                    </a>
                                                </div>
                                            )}
                                            {project.socialLinks.youtube && (
                                                <div>
                                                    <strong>YouTube:</strong> 
                                                    <a href={project.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="ms-2">
                                                        {project.socialLinks.youtube}
                                                    </a>
                                                </div>
                                            )}
                                            {project.socialLinks.facebook && (
                                                <div>
                                                    <strong>Facebook:</strong> 
                                                    <a href={project.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="ms-2">
                                                        {project.socialLinks.facebook}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="fw-bold mb-2">Informações do Projeto</div>
                                    <div style={{ color: '#666' }}>
                                        <div><strong>Tipo:</strong> {project.type}</div>
                                        <div><strong>Status:</strong> {StatusText({ status: project.status })}</div>
                                        <div><strong>Data de Criação:</strong> {new Date(project.createdAt).toLocaleString('PT-BR')}</div>
                                        {project.updatedAt && (
                                            <div><strong>Última Atualização:</strong> {new Date(project.updatedAt).toLocaleString('PT-BR')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <div className="d-flex justify-content-end gap-3 mt-4">
                {project.status === 'rejected' && (
                    <Button variant="outline-secondary" className="rounded-pill">Solicitar revisão</Button>
                )}
                <Button 
                    variant="danger" 
                    className="rounded-pill"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? 'Excluindo...' : 'Excluir'}
                </Button>
            </div>
        </Container>
    );
};

function Projects() {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('agentToken');
            const response = await fetch(buildApiUrl('/projects'), {
                headers: {
                    'Authorization': token
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Falha ao carregar projetos. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectDeleted = () => {
        setSelectedProject(null);
        fetchProjects();
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(projects.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (showNewProjectForm) {
        return <NewProjectForm 
            onClose={() => setShowNewProjectForm(false)} 
            onSuccess={() => {
                setShowNewProjectForm(false);
                fetchProjects();
            }} 
        />;
    }

    if (selectedProject) {
        return <ProjectDetails 
            project={selectedProject} 
            onBack={() => setSelectedProject(null)}
            onDelete={handleProjectDeleted}
        />;
    }

    return (
        <Container className="">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Lista de projetos</h5>
                <Button 
                    className="rounded-pill btn bg-light text-dark border"
                    onClick={() => setShowNewProjectForm(true)}
                >
                    Criar novo projeto
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">Carregando projetos...</div>
            ) : error ? (
                <div className="text-center py-5 text-danger">{error}</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-5">Nenhum projeto encontrado. Crie um novo projeto!</div>
            ) : (
                <>
                    <div className="d-flex flex-column gap-3">
                        {currentItems.map(project => (
                            <div key={project._id} onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                    
                    {projects.length > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center gap-2">
                                <span>Itens por página:</span>
                                <select 
                                    className="form-select form-select-sm" 
                                    style={{ width: 'auto' }}
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                >
                                    {[10, 20, 50, 100].map(value => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button 
                                                className="page-link"
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Próximo
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
}

export default Projects;
