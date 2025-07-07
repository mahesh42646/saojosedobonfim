"use client";
import React, { useState, useEffect, Suspense } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './page.css';
import Header from "../Header";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { buildApiUrl } from '../../config/api';

// Base URL for images (without /api)
const IMAGE_BASE_URL = 'https://mapacultural.saojosedobonfim.pb.gov.br';

function AgentProfileContent() {
    const searchParams = useSearchParams();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const agentId = searchParams.get('id');
                const agentType = searchParams.get('type');
                if (!agentId) {
                    setError('No agent ID provided');
                    setLoading(false);
                    return;
                }

                // Fetch the specific agent profile using the public endpoint
                const response = await fetch(buildApiUrl(`/public/agent/${agentId}?type=${agentType || ''}`), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch agent profile');
                }

                const data = await response.json();
                // Store both the agent data and the requested type
                setAgent({ ...data, requestedType: agentType });
            } catch (err) {
                console.error('Error fetching agent:', err);
                setError('Failed to load agent profile');
            } finally {
                setLoading(false);
            }
        };

        fetchAgent();
    }, [searchParams]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
    }

    if (error) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>{error}</div>;
    }

    if (!agent) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Agente não encontrado</div>;
    }

    // Get display name based on requested profile type
    const getDisplayName = () => {
        const requestedType = agent.requestedType?.toLowerCase();
        
        if (requestedType === 'business' && agent.typeStatus?.business?.isComplete) {
            return agent.businessData?.nomeFantasia || agent.businessData?.razaoSocial || agent.fullname;
        }
        if (requestedType === 'collective' && agent.typeStatus?.collective?.isComplete) {
            return agent.collectiveData?.collectiveName || agent.fullname;
        }
        // Default to personal or fallback to fullname
        return agent.fullname;
    };

    // Get agent type for display based on requested type
    const getAgentType = () => {
        const requestedType = agent.requestedType?.toLowerCase();
        
        if (requestedType === 'personal' && agent.typeStatus?.personal?.isComplete) return 'INDIVIDUAL';
        if (requestedType === 'business' && agent.typeStatus?.business?.isComplete) return 'PESSOA JURÍDICA';
        if (requestedType === 'collective' && agent.typeStatus?.collective?.isComplete) return 'GRUPO COLETIVO';
        
        // Fallback to any completed type
        if (agent.typeStatus?.personal?.isComplete) return 'INDIVIDUAL';
        if (agent.typeStatus?.business?.isComplete) return 'PESSOA JURÍDICA';
        if (agent.typeStatus?.collective?.isComplete) return 'GRUPO COLETIVO';
        return 'TIPO NÃO DEFINIDO';
    };

    // Get profile photo based on requested type
    const getProfilePhoto = () => {
        const requestedType = agent.requestedType?.toLowerCase();
        
        if (requestedType && agent.profilePhotos && agent.profilePhotos[requestedType]) {
            return `${IMAGE_BASE_URL}/uploads/${agent.profilePhotos[requestedType]}`;
        }
        
        // Fallback to any available profile photo
        if (agent.profilePhotos) {
            if (agent.profilePhotos.personal) return `${IMAGE_BASE_URL}/uploads/${agent.profilePhotos.personal}`;
            if (agent.profilePhotos.business) return `${IMAGE_BASE_URL}/uploads/${agent.profilePhotos.business}`;
            if (agent.profilePhotos.collective) return `${IMAGE_BASE_URL}/uploads/${agent.profilePhotos.collective}`;
        }
        
        return null;
    };

    // Get agent description based on requested type
    const getAgentDescription = () => {
        const requestedType = agent.requestedType?.toLowerCase();
        
        // First, try to get profile-specific about text
        if (requestedType && agent.publicProfile?.[requestedType]?.aboutText) {
            return agent.publicProfile[requestedType].aboutText;
        }
        
        // Fallback to general description or generate based on type
        if (agent.description) return agent.description;
        
        if (requestedType === 'business' && agent.typeStatus?.business?.isComplete) {
            return `${agent.businessData?.nomeFantasia || 'Empresa'} atua no cenário cultural com foco em ${agent.mainActivity || 'diversas atividades culturais'}. ${agent.otherActivity || ''}`;
        }
        if (requestedType === 'collective' && agent.typeStatus?.collective?.isComplete) {
            return `Coletivo cultural formado em ${agent.collectiveData?.monthCreated}/${agent.collectiveData?.yearCreated}, com ${agent.collectiveData?.participants || 'diversos'} participantes. Focado em ${agent.mainActivity || 'atividades culturais diversas'}. ${agent.otherActivity || ''}`;
        }
        return `Artista atuante em ${agent.mainActivity || 'diversas áreas culturais'}${agent.otherActivity ? `. ${agent.otherActivity}` : ''}.`;
    };

    // Get agent's gallery images based on profile type
    const getGalleryImages = () => {
        const requestedType = agent.requestedType?.toLowerCase();
        
        // Try to get gallery from profile-specific public profile data
        let galleryPhotos = null;
        if (requestedType && agent.publicProfile?.[requestedType]?.galleryPhotos) {
            galleryPhotos = agent.publicProfile[requestedType].galleryPhotos;
        } else if (agent.gallery) {
            galleryPhotos = agent.gallery;
        }
        
        if (galleryPhotos && galleryPhotos.length > 0) {
            return galleryPhotos.map((img, index) => ({
                src: `${IMAGE_BASE_URL}/uploads/${img}`,
                alt: `Gallery ${index + 1}`
            }));
        }
        
        // Return default images if no gallery is provided
        return [
            { src: '/images/photo1.png', alt: 'Gallery 1' },
            { src: '/images/photo2.png', alt: 'Gallery 2' },
            { src: '/images/photo3.png', alt: 'Gallery 3' },
            { src: '/images/photo4.png', alt: 'Gallery 4' }
        ];
    };

    const galleryImages = getGalleryImages();

    return (
        <div style={{ background: "#fff", minHeight: "100vh", color: "#111" }}>
            {/* Header */}
            <Header />

            {/* Cover Image */}
            <div style={{
                width: "100%",
                height: 400,
                position: "relative",
                overflow: "hidden"
            }}>
                {agent.coverImage ? (
                    <Image
                        src={`${IMAGE_BASE_URL}/${agent.coverImage}`}
                        alt="Cover"
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "center"
                        }}
                    />
                ) : (
                    <Image
                        src="/images/banner2.png"
                        alt="Cover"
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "center"
                        }}
                    />
                )}
                {/* Dark overlay */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))"
                }} />
            </div>

            {/* Profile Section */}
            <div style={{
                maxWidth: 1200,
                margin: "-100px auto 0",
                padding: "0 20px",
                position: "relative",
                zIndex: 2
            }}>
                {/* Profile Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    display: "flex",
                    gap: 30,
                    marginBottom: 40
                }}>
                    {/* Profile Image */}
                    <div style={{
                        width: 200,
                        height: 200,
                        position: "relative",
                        flexShrink: 0
                    }}>
                        {getProfilePhoto() ? (
                            <Image
                                src={getProfilePhoto()}
                                alt={getDisplayName()}
                                fill
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid #fff",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                background: "#2CB34A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 64,
                                fontWeight: "bold",
                                border: "4px solid #fff",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}>
                                {getDisplayName().charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
                                {getDisplayName()}
                            </h1>
                            {agent.isVerified && (
                                <i className="bi bi-patch-check-fill" style={{ fontSize: 24, color: '#2CB34A' }}></i>
                            )}
                        </div>
                        
                        <div style={{ fontSize: 18, color: "#666", marginBottom: 20 }}>
                            TIPO: {getAgentType()}
                        </div>

                        {/* Business-specific info */}
                        {agent.requestedType?.toLowerCase() === 'business' && agent.typeStatus?.business?.isComplete && agent.businessData?.razaoSocial && (
                            <div style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
                                Razão Social: {agent.businessData.razaoSocial}
                            </div>
                        )}

                        {/* Social Links */}
                        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                            {(() => {
                                const requestedType = agent.requestedType?.toLowerCase();
                                const socialLinks = agent.publicProfile?.[requestedType]?.socialLinks || agent.socialLinks || {};
                                
                                return (
                                    <>
                                        {socialLinks.facebook && (
                                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#444", fontSize: 24 }}>
                                                <i className="bi bi-facebook"></i>
                                            </a>
                                        )}
                                        {socialLinks.instagram && (
                                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#444", fontSize: 24 }}>
                                                <i className="bi bi-instagram"></i>
                                            </a>
                                        )}
                                        {socialLinks.youtube && (
                                            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ color: "#444", fontSize: 24 }}>
                                                <i className="bi bi-youtube"></i>
                                            </a>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    marginBottom: 40,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: 600 }}>Sobre</h2>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: "#444" }}>
                        {getAgentDescription()}
                    </p>
                </div>

                {/* Gallery */}
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    marginBottom: 40,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: 600 }}>Galeria</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 20
                    }}>
                        {galleryImages.map((img, index) => (
                            <div key={index} style={{
                                aspectRatio: "1",
                                position: "relative",
                                borderRadius: 12,
                                overflow: "hidden"
                            }}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    marginBottom: 40,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}>
                    <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: 600 }}>Contato</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 30 }}>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Email:</div>
                            <div style={{ color: "#666" }}>{agent.email}</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Telefone:</div>
                            <div style={{ color: "#666" }}>{agent.telephone}</div>
                        </div>
                        {agent.city && (
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>Cidade:</div>
                                <div style={{ color: "#666" }}>{agent.city}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: "#222",
                color: "#fff",
                padding: "20px 0",
                marginTop: 60
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>MAPA CULTURA - © 2025 Todos os direitos reservados</span>
                    <span style={{ color: "#2CB34A" }}>Desenvolvido por Devactiva Tecnologia</span>
                </div>
            </footer>
        </div>
    );
}

export default function AgentProfile() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Carregando...
            </div>
        }>
            <AgentProfileContent />
        </Suspense>
    );
}