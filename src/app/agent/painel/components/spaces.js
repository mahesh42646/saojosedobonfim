"use client"
import React, { useState } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import Image from 'next/image';
import { FaCheck, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import NewSpaceForm from './new-Space-form.js';

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

const SpaceCard = ({ Space }) => (
    <div className={`d-flex align-items-center  p-1 rounded-3 ${Space.status === SpaceStatus.PENDING ? 'bg-' : 'bg-' }`} 
    style={{ border: '0.01px solid rgb(255, 255, 255)', backgroundColor: 'rgba(79, 182, 0, 0.1)' }}
    >
        <Image
            src={Space.image}
            alt={Space.title}
            width={70}
            height={70}
            className="rounded-circle border-dark p-1"

        />
        <div className="ms-4 flex-grow-1">
            <p className=" m-0">{Space.title}</p>
            <p className=" m-0 text-secondary">TIPO: {Space.type}</p>
            <div className="d-flex align-items-center gap-2">
                <StatusIcon status={Space.status} />
                <span className="">{StatusText({ status: Space.status })}</span>
            </div>
        </div>
    </div>
);

const SpaceDetails = ({ space, onBack }) => {
    const [activeTab, setActiveTab] = useState('updates');

    // Dummy updates for demonstration
    const updates = [
        {
            date: 'segunda-feira, 5 de maio 21:51',
            text: 'Espaço criado com sucesso',
            status: 'success'
        },
        {
            date: 'sexta-feira, 9 de maio 10:01',
            text: 'Espaço aprovado e publicado',
            status: 'approved'
        }
    ];

    // Dummy details, in real use, get from space object
    const details = {
        type: space.type,
        name: space.title,
        description: space.description || "Lorem Ipsum is simply dummy text...",
        capacity: space.capacity || "100",
        hours: space.hours || "08:00 - 18:00",
        days: space.days || "Segunda a Sexta",
        address: space.address || "Brejo do Cruz/PB - CEP: 58890000",
        social: space.social || {
            instagram: "https://instagram.com/example",
            youtube: "",
            facebook: ""
        }
    };

    return (
        <Container className="pt-4 rounded-4 border ">
          <div className="d-flex mb-3 align-items-center">
          <Button  onClick={onBack} className=" btn bg-light text-dark border-0">&larr; </Button>
          <h5 className="fw-bold m-0">Detalhes do espaço</h5>
          </div>
            <div className="d-flex align-items-center p-1 rounded-3 mb-4" style={{ border: '0.01px solid rgb(255, 255, 255)', backgroundColor: 'rgba(79, 182, 0, 0.1)' }}>
                <Image
                    src={space.image}
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
                        <div><b>Nome:</b> {details.name}</div>
                        <div><b>Tipo:</b> {details.type}</div>
                        <div><b>Descrição:</b> <div className="border rounded-3 p-2 my-2" style={{ background: "#f8f9fa" }}>{details.description}</div></div>
                        <div><b>Capacidade:</b> {details.capacity}</div>
                        <div><b>Horário:</b> {details.hours}</div>
                        <div><b>Dias de funcionamento:</b> {details.days}</div>
                        <div><b>Endereço:</b> {details.address}</div>
                        <div className="mt-2">
                            <b>Redes sociais:</b>
                            <ul>
                                {details.social.instagram && <li>Instagram: <a href={details.social.instagram} target="_blank" rel="noopener noreferrer">{details.social.instagram}</a></li>}
                                {details.social.youtube && <li>YouTube: <a href={details.social.youtube} target="_blank" rel="noopener noreferrer">{details.social.youtube}</a></li>}
                                {details.social.facebook && <li>Facebook: <a href={details.social.facebook} target="_blank" rel="noopener noreferrer">{details.social.facebook}</a></li>}
                            </ul>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            <div className="d-flex justify-content-end gap-3 mt-4">
                <Button variant="outline-secondary" className="rounded-pill">Solicitar revisão</Button>
                <Button variant="danger" className="rounded-pill">Excluir</Button>
            </div>
        </Container>
    );
};

function Spaces() {
    const [showNewSpaceForm, setShowNewSpaceForm] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const spaces = [
        {
            id: 1,
            title: 'Ateliê',
            type: 'ATELIÊ',
            status: SpaceStatus.APPROVED,
            image: '/images/card.png', 
            description: "Espaço para atividades artísticas.",
            capacity: "50",
            hours: "09:00 - 17:00",
            days: "Segunda a Sexta",
            address: "Brejo do Cruz/PB - CEP: 58890000",
            social: {
                instagram: "https://instagram.com/example",
                youtube: "",
                facebook: ""
            }
        },
        {
            id: 1,
            title: 'Biblioteca',
            type: 'BIBLIOTECA',
            status: SpaceStatus.APPROVED,
            image: '/images/card.png', 
            description: "Espaço para leitura e estudo.",
            capacity: "100",
            hours: "08:00 - 18:00",
            days: "Segunda a Sábado",
            address: "Brejo do Cruz/PB - CEP: 58890000",
            social: {
                instagram: "https://instagram.com/example",
                youtube: "",
                facebook: ""
            }
        },
    ];

    if (showNewSpaceForm) {
        return <NewSpaceForm onClose={() => setShowNewSpaceForm(false)} />;
    }

    if (selectedSpace) {
        return <SpaceDetails space={selectedSpace} onBack={() => setSelectedSpace(null)} />;
    }

    return (
        <Container className="">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Lista de Espaços </h5>
                <Button 
                    className="rounded-pill btn bg-light text-dark border"
                    onClick={() => setShowNewSpaceForm(true)}
                >
                    Criar novo espaço
                </Button>
            </div>

            <div className="d-flex flex-column gap-3">
                {spaces.map(Space => (
                    <div key={Space.id} onClick={() => setSelectedSpace(Space)} style={{ cursor: 'pointer' }}>
                        <SpaceCard Space={Space} />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Spaces;
