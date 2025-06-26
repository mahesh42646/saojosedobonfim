"use client"
import React, { useState } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import Image from 'next/image';
import { FaCheck, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import NewProjectForm from './new-project-form';

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

const ProjectCard = ({ project }) => (
    <div className={`d-flex align-items-center p-1 rounded-3 ${project.status === ProjectStatus.PENDING ? 'bg-' : 'bg-'}`}
    style={{ border: '0.01px solid rgb(255, 255, 255)', backgroundColor: 'rgba(79, 182, 0, 0.1)' }}>
        <Image
            src={project.image}
            alt={project.title}
            width={70}
            height={70}
            className="rounded-circle border-dark p-1"
        />
        <div className="ms-4 flex-grow-1">
            <p className=" m-0">{project.title}</p>
            <p className=" m-0 text-secondary">TIPO: {project.type}</p>
            <div className="d-flex align-items-center gap-2">
                <StatusIcon status={project.status} />
                <span className="">{StatusText({ status: project.status })}</span>
            </div>
        </div>
    </div>
);

const ProjectDetails = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('updates');

    // Dummy updates for demonstration
    const updates = [
        {
            date: 'segunda-feira, 5 de maio 21:51',
            text: 'Projeto criado com sucesso',
            status: 'success'
        },
        {
            date: 'sexta-feira, 9 de maio 10:01',
            text: 'Projeto aprovado e publicado',
            status: 'approved'
        }
    ];

    // Dummy details, in real use, get from project object
    const details = {
        type: project.type,
        name: project.title,
        description: project.description || "Lorem Ipsum is simply dummy text...",
        coverPhoto: project.coverPhoto || '/images/card.png',
        photos: project.photos || [],
        period: project.period || { start: "2024-05-01", end: "2024-05-10" },
        social: project.social || {
            instagram: "https://instagram.com/example",
            youtube: "",
            facebook: ""
        }
    };

    return (
        <Container className="pt-4 rounded-4 border">
            <div className="d-flex mb-3 align-items-center">
                <Button onClick={onBack} className="btn bg-light text-dark border-0">&larr;</Button>
                <h5 className="fw-bold m-0 ms-2">Detalhes do projeto</h5>
            </div>
            <div className="d-flex align-items-center p-1 rounded-3 mb-4" style={{ border: '0.01px solid rgb(255, 255, 255)', backgroundColor: 'rgba(79, 182, 0, 0.1)' }}>
                <Image
                    src={project.image}
                    alt={project.title}
                    width={70}
                    height={70}
                    className="rounded-circle border-dark p-1"
                />
                <div className="ms-4 flex-grow-1">
                    <p className="m-0 fw-bold" style={{ fontSize: 20 }}>{project.title}</p>
                    <p className="m-0 text-secondary">TIPO: {project.type}</p>
                    <div className="d-flex align-items-center gap-2">
                        <StatusIcon status={project.status} />
                        <span>{StatusText({ status: project.status })}</span>
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
                        <div><b>Capa:</b>
                            <div className="my-2">
                                <Image src={details.coverPhoto} alt="Capa" width={120} height={120} style={{ borderRadius: 8 }} />
                            </div>
                        </div>
                        <div><b>Galeria de fotos:</b>
                            <div className="d-flex gap-2 flex-wrap my-2">
                                {details.photos.length > 0 ? details.photos.map((photo, idx) => (
                                    <Image key={idx} src={photo} alt={`Foto ${idx + 1}`} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 8 }} />
                                )) : <span className="text-muted">Nenhuma foto</span>}
                            </div>
                        </div>
                        <div><b>Período de execução:</b> {details.period.start} até {details.period.end}</div>
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

function Projects() {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            id: 1,
            title: 'Cinema na Comunidade',
            type: 'MOSTRA',
            status: ProjectStatus.APPROVED,
            image: '/images/card.png',
            description: "Mostra de cinema comunitário.",
            coverPhoto: '/images/card.png',
            photos: ['/images/card.png'],
            period: { start: "2024-05-01", end: "2024-05-10" },
            social: {
                instagram: "https://instagram.com/example",
                youtube: "",
                facebook: ""
            }
        },
        {
            id: 1,
            title: 'Festival de Cinema',
            type: 'MOSTRA',
            status: ProjectStatus.APPROVED,
            image: '/images/card.png',
            description: "Festival de cinema comunitário.",
            coverPhoto: '/images/card.png',
            photos: ['/images/card.png'],
            period: { start: "2024-05-01", end: "2024-05-10" },
            social: {
                instagram: "https://instagram.com/example",
                youtube: "",
                facebook: ""
            }
        },
        // Add more projects as needed
    ];

    if (showNewProjectForm) {
        return <NewProjectForm onClose={() => setShowNewProjectForm(false)} />;
    }

    if (selectedProject) {
        return <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />;
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

            <div className="d-flex flex-column gap-3">
                {projects.map(project => (
                    <div key={project.id} onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Projects;
