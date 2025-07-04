"use client"
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import Image from 'next/image';
import { FaCheck, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import NewSpaceForm from './new-Space-form.js';
import { buildApiUrl } from '../../../config/api';

const SpaceStatus = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected'
};

const StatusIcon = ({ status }) => {
    switch (status) {
        case SpaceStatus.APPROVED:
            return <FaCheck className="text-success" />;
        case SpaceStatus.PENDING:
            return <FaExclamationCircle className="text-warning" />;
        case SpaceStatus.REJECTED:
            return <FaTimes className="text-danger" />;
        default:
            return null;
    }
};

const StatusText = ({ status }) => {
    switch (status) {
        case SpaceStatus.APPROVED:
            return 'Espaço aprovado e publicado';
        case SpaceStatus.PENDING:
            return 'Espaço pendente de aprovação';
        case SpaceStatus.REJECTED:
            return 'Espaço recusado';
        default:
            return '';
    }
};

const SpaceCard = ({ space }) => {
    const [imgError, setImgError] = useState(false);
    
    return (
        <div className={`d-flex align-items-center p-2 bg-secondary-lite rounded-4 ${space.status === SpaceStatus.PENDING ? 'bg-' : 'bg-' }`} 
    style={{ border: '0.01px solid rgb(255, 255, 255)' }}
    >
        <Image
                src={!imgError && space.coverPhoto ? `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}` : '/images/card.png'}
                alt={space.title}
            width={70}
            height={70}
            className="rounded-circle border-dark p-1"
                onError={() => setImgError(true)}
                priority={true}
        />
        <div className="ms-4 flex-grow-1">
                <p className="m-0 fw-bold" style={{ fontSize: 16 }}>{space.title}</p>
                <p className="m-0 text-secondary">TIPO: {space.type}</p>
            <div className="d-flex align-items-center gap-2">
                    <StatusIcon status={space.status} />
                    <span className="">{StatusText({ status: space.status })}</span>
            </div>
        </div>
    </div>
);
};

const SpaceDetails = ({ space, onBack, onDelete }) => {
    const [activeTab, setActiveTab] = useState('updates');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this space?')) return;
        
        try {
            setLoading(true);
            const response = await fetch(buildApiUrl(`/space/${space._id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': 'dummy-token-for-testing'
                }
            });

            if (!response.ok) throw new Error('Failed to delete space');
            
            onDelete();
        } catch (error) {
            console.error('Error deleting space:', error);
            alert('Failed to delete space. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format the dates for updates
    const updates = [
        {
            date: new Date(space.createdAt).toLocaleString('PTBR'),
            text: 'Espaço criado com sucesso',
            status: 'success'
        }
    ];

    if (space.status === 'approved') {
        updates.push({
            date: new Date(space.updatedAt).toLocaleString('PTBR'),
            text: 'Espaço aprovado e publicado',
            status: 'approved'
        });
    }

    return (
        <Container className="pt-4 rounded-4 border">
          <div className="d-flex mb-3 align-items-center">
                <Button onClick={onBack} className="btn bg-light text-dark border-0">&larr;</Button>
          <h5 className="fw-bold m-0">Detalhes do espaço</h5>
          </div>
            <div className="d-flex align-items-center p-1 rounded-3 mb-4" style={{ border: '0.01px solid rgb(255, 255, 255)', backgroundColor: 'rgba(79, 182, 0, 0.1)' }}>
                <Image
                    src={space.coverPhoto ? `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${space.coverPhoto}` : '/images/card.png'}
                    alt={space.title}
                    width={70}
                    height={70}
                    className="rounded-circle border-dark p-1"
                />
                <div className="ms-4 flex-grow-1">
                    <p className="m-0 fw-bold" style={{ fontSize: 20 }}>{space.title}</p>
                    <p className="m-0 text-secondary">TIPO: {space.type}</p>
                    <div className="d-flex align-items-center gap-2">
                        <StatusIcon status={space.status} />
                        <span>{StatusText({ status: space.status })}</span>
                    </div>
                </div>
            </div>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Tab eventKey="updates" title="Atualizações">
                    <div className="p-3">
                        {updates.map((u, idx) => (
                            <div key={idx} className="mb-3 d-flex align-items-center">
                                <FaCheck className="text-success me-2" />
                                <div>
                                    <div className="fw-bold">{u.date}</div>
                                    <div className={u.status === 'approved' ? "fw-bold" : ""}>{u.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab eventKey="details" title="Detalhes">
                    <div className="p-3">
                        <div><b>Nome:</b> {space.title}</div>
                        <div><b>Tipo:</b> {space.type}</div>
                        <div><b>Descrição:</b> <div className="border rounded-3 p-2 my-2" style={{ background: "#f8f9fa" }}>{space.description}</div></div>
                        <div><b>Capacidade:</b> {space.capacity}</div>
                        <div><b>Horário:</b> {space.operatingHours}</div>
                        <div><b>Dias de funcionamento:</b> {space.operatingDays}</div>
                        <div><b>Endereço:</b> {space.location?.address}</div>
                        <div className="mt-2">
                            <b>Redes sociais:</b>
                            <ul>
                                {space.socialLinks?.instagram && <li>Instagram: <a href={space.socialLinks.instagram} target="_blank" rel="noopener noreferrer">{space.socialLinks.instagram}</a></li>}
                                {space.socialLinks?.youtube && <li>YouTube: <a href={space.socialLinks.youtube} target="_blank" rel="noopener noreferrer">{space.socialLinks.youtube}</a></li>}
                                {space.socialLinks?.facebook && <li>Facebook: <a href={space.socialLinks.facebook} target="_blank" rel="noopener noreferrer">{space.socialLinks.facebook}</a></li>}
                            </ul>
                        </div>
                        {space.accessibility && (
                            <div className="mt-2">
                                <b>Acessibilidade:</b>
                                <ul>
                                    {space.accessibility.adaptedToilets && <li>Banheiros adaptados</li>}
                                    {space.accessibility.accessRamp && <li>Rampa de acesso</li>}
                                    {space.accessibility.elevator && <li>Elevador</li>}
                                    {space.accessibility.tactileSignaling && <li>Sinalização tátil</li>}
                                    {space.accessibility.adaptedDrinkingFountain && <li>Bebedouro adaptado</li>}
                                    {space.accessibility.handrail && <li>Corrimão nas escadas e rampas</li>}
                                    {space.accessibility.adaptedElevator && <li>Elevador adaptado</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>
            <div className="d-flex justify-content-end gap-3 mt-4">
                {space.status === 'rejected' && (
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

function Spaces() {
    const [showNewSpaceForm, setShowNewSpaceForm] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchSpaces = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(buildApiUrl('/spaces'), {
                headers: {
                    'Authorization': 'dummy-token-for-testing'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch spaces');
            
            const data = await response.json();
            setSpaces(data);
        } catch (error) {
            console.error('Error fetching spaces:', error);
            setError('Failed to load spaces. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    const handleSpaceDeleted = () => {
        setSelectedSpace(null);
        fetchSpaces();
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = spaces.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(spaces.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (showNewSpaceForm) {
        return <NewSpaceForm onClose={() => setShowNewSpaceForm(false)} onSuccess={() => {
            setShowNewSpaceForm(false);
            fetchSpaces();
        }} />;
    }

    if (selectedSpace) {
        return <SpaceDetails 
            space={selectedSpace} 
            onBack={() => setSelectedSpace(null)}
            onDelete={handleSpaceDeleted}
        />;
    }

    return (
        <Container className="">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Lista de Espaços</h5>
                <Button 
                    className="rounded-pill btn bg-light text-dark border"
                    onClick={() => setShowNewSpaceForm(true)}
                >
                    Criar novo espaço
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">Carregando espaços...</div>
            ) : error ? (
                <div className="text-center py-5 text-danger">{error}</div>
            ) : spaces.length === 0 ? (
                <div className="text-center py-5">Nenhum espaço encontrado. Crie um novo espaço!</div>
            ) : (
                <>
                    <div className="d-flex flex-column gap-3">
                        {currentItems.map(space => (
                            <div key={space._id} onClick={() => setSelectedSpace(space)} style={{ cursor: 'pointer' }}>
                                <SpaceCard space={space} />
                            </div>
                        ))}
                    </div>

                    {spaces.length > 1 && (
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

export default Spaces;
