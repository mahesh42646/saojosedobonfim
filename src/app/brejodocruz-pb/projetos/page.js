"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './page.css';
import Header from "../Header";
import { buildApiUrl } from '../../config/api';
import Image from 'next/image';

function ProjectContent() {
    const searchParams = useSearchParams();
    const spaceId = searchParams.get('id');
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creator, setCreator] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!spaceId) {
                setLoading(false);
                return;
            }

            try {
                // First fetch project details
                const projectResponse = await fetch(buildApiUrl(`/public/project/${spaceId}`));
                if (!projectResponse.ok) {
                    throw new Error('Failed to fetch project details');
                }
                const projectData = await projectResponse.json();
                setSpace(projectData);

                // Then fetch agent profile using agentId from project data
                if (projectData.agentId) {
                    const agentResponse = await fetch(buildApiUrl(`/agent/profile/${projectData.agentId}`));
                    if (agentResponse.ok) {
                        const agentData = await agentResponse.json();
                        setCreator(agentData);
                    }
                }
            } catch (err) {
                console.error('Error fetching project:', err);
                setError('Failed to load project details');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [spaceId]);

    if (loading) {
        return <div className="text-center p-5">Loading...</div>;
    }

    if (error || !space) {
        return <div className="text-center p-5">Error loading space details</div>;
    }

    return (
        <div className="min-vh-100 bg-white text-dark">
            <Header />

            <div className="container mt-4">
                {/* Main Image */}
                <div className="rounded-4 border h-100 overflow-hidden" style={{ maxHeight: "400px" }}>
                    <Image
                        src={space.coverPhoto ? `https://mapacultural.gestorcultural.com.br/uploads/${space.coverPhoto}` : "/images/image2.png"}
                        alt={space.title}
                        width={1200}
                        height={400}
                        className="w-100 h-100 object-fit-cover"
                        priority
                    />
                </div>

                {/* Title and Creator Section */}
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="display-5 fw-bold mb-2">
                                Projeto Cultural
                            </h1>
                            <h2 className="display-6 fw-bold">
                                {space.title}
                            </h2>
                            <p className="text-secondary">
                                {space.type}
                            </p>
                        </div>
                        <div className="text-end">
                            <p className="fs-5 mb-1">
                                {creator?.fullname || creator?.socialname || 'Nome não disponível'}
                            </p>
                            <p className="text-secondary">
                                {creator?.mainActivity || 'Agente Cultural'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project Period */}
                {space.period && (
                    <div className="mt-4">
                        <div className="p-4 bg-light rounded-4 border">
                            <h6 className="fw-bold">Período do Projeto:</h6>
                            <p className="mb-0">
                                De: {new Date(space.period.start).toLocaleDateString()} 
                                {space.period.end && ` Até: ${new Date(space.period.end).toLocaleDateString()}`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="mt-4">
                    <div className="p-4 bg-light rounded-4 border">
                        <div dangerouslySetInnerHTML={{ __html: space.description }} />
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-4 d-flex gap-4">
                    {space.socialLinks?.facebook && (
                        <a href={space.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                            <i className="bi bi-facebook"></i>
                        </a>
                    )}
                    {space.socialLinks?.instagram && (
                        <a href={space.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                            <i className="bi bi-instagram"></i>
                        </a>
                    )}
                    {space.socialLinks?.youtube && (
                        <a href={space.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                            <i className="bi bi-youtube"></i>
                        </a>
                    )}
                </div>

                {/* Capacity and Hours */}
                <div className="mt-4 row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <h6 className="fw-bold">Capacity:</h6>
                            <p className="mb-0">{space.capacity} PESSOAS</p>
                        </div>
                        <div className="mb-3">
                            <h6 className="fw-bold">Opening time:</h6>
                            <p className="mb-0">{space.operatingHours}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <h6 className="fw-bold">Email:</h6>
                            <p className="mb-0">{creator?.email || 'cinemacomunidade@gmail.com'}</p>
                        </div>
                        <div>
                            <h6 className="fw-bold">Phone:</h6>
                            <p className="mb-0">{creator?.telephone || '(83) 9 9999-9999'}</p>
                        </div>
                    </div>
                </div>

                {/* Photo Gallery */}
                {space.photos && space.photos.length > 0 && (
                    <div className="mt-4">
                        <h3 className="h5 mb-3">
                            <i className="bi bi-camera"></i> Photo gallery
                        </h3>
                        <div className="row g-3">
                            {space.photos.map((photo, index) => (
                                <div key={index} className="col-md-3">
                                    <div className="rounded-4 border overflow-hidden">
                                        <Image
                                            src={`https://mapacultural.gestorcultural.com.br/uploads/${photo}`}
                                            alt={`Gallery ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                

                {/* Location */}
                <div className="mt-4 mb-5">
                    <h3 className="h5 mb-3">
                        <i className="bi bi-geo-alt"></i> Brejo do Cruz/PB - 58890-000
                    </h3>
                    <div className="rounded-4 border overflow-hidden" style={{ height: '300px' }}>
                        <iframe
                            src="https://www.openstreetmap.org/export/embed.html?bbox=-37.507%2C-6.350%2C-37.497%2C-6.340&amp;layer=mapnik"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

         
        </div>
    );
}

export default function BrejoDoCruzPB() {
    return (
        <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
            <ProjectContent />
        </Suspense>
    );
}