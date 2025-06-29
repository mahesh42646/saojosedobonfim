"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import './page.css';
import Header from "../Header";
import { buildApiUrl } from '../../config/api';

function SpaceDetailsContent() {
    const searchParams = useSearchParams();
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const spaceId = searchParams.get('id');
        if (spaceId) {
            fetchSpaceDetails(spaceId);
        }
    }, [searchParams]);

    const fetchSpaceDetails = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(buildApiUrl(`/public/space/${id}`));
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch space details');
            }

            const data = await response.json();
            if (!data) {
                throw new Error('No data received');
            }
            
            setSpace(data);
        } catch (err) {
            console.error('Error fetching space details:', err);
            setError(err.message || 'Failed to load space details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Carregando...
            </div>
        );
    }

    if (error || !space) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
                {error || 'Espaço não encontrado'}
            </div>
        );
    }

    return (
        <div style={{ background: "#fff", minHeight: "100vh", color: "#111" }}>
            {/* Header */}
            <Header />

            {/* Hero Image */}
            <div style={{ width: "100%", height: 220, background: "#000", position: "relative" }}>
                <div>
                    {space.coverPhoto ? (
                        <Image
                            src={`https://mapacultural.gestorcultural.com.br/uploads/${space.coverPhoto}`}
                            alt={space.title}
                            width={1200}
                            height={300}
                            style={{ width: "100%", height: 300, objectFit: "cover" }}
                        />
                    ) : (
                        <Image    
                            src="/images/image1.png"
                            alt="Banner"
                            style={{ width: "100%", height: 300, objectFit: "cover" }}
                            width={100}
                            height={100}
                        />
                    )}
                </div>
                {/* Profile Card */}
                <div style={{
                    position: "absolute",
                    left: "27%",
                    transform: "translateX(-50%)",
                    bottom: -200,
                    color: "#000",
                    borderRadius: 15,
                    padding: "18px 30px 18px 18px",
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "90vw"
                }}>
                    <div style={{ width: '100%' }}>
                        <h2 className="fw-bold">
                            {space.title}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Spacer for profile card */}
            <div style={{ height: '180px' }} />

            {/* About Section */}
            <section style={{
                background: "#fff",
                color: "#111",
                borderRadius: 10,
                margin: "0 auto",
                maxWidth: "70vw",
                padding: 0,
                marginBottom: 0
            }}>
                <div style={{ padding: "0 30px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "20px 0 8px 0" }}>
                        <h4 style={{ fontWeight: "bold", fontSize: 16, margin: 0 }}>{space.type}</h4>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>
                        {space.description}
                    </div>
                    <div style={{ width: '100%', marginTop: 24, marginBottom: 24 }}>
                        <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
                            {space.socialLinks?.facebook && (
                                <a href={space.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                    <span style={{ fontSize: 20, color: "#222" }}><i className="bi bi-facebook"></i></span>
                                </a>
                            )}
                            {space.socialLinks?.instagram && (
                                <a href={space.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    <span style={{ fontSize: 20, color: "#222" }}><i className="bi bi-instagram"></i></span>
                                </a>
                            )}
                            {space.socialLinks?.youtube && (
                                <a href={space.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                                    <span style={{ fontSize: 20, color: "#222" }}><i className="bi bi-youtube"></i></span>
                                </a>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, fontSize: 15 }}>
                            <div style={{ minWidth: 180 }}>
                                <div style={{ fontWeight: 600 }}>Capacity:</div>
                                <div>{space.capacity}</div>
                                <div style={{ fontWeight: 600, marginTop: 16 }}>Operating Hours:</div>
                                <div>{space.operatingHours}</div>
                            </div>
                            <div style={{ minWidth: 180 }}>
                                <div style={{ fontWeight: 600 }}>Operating Days:</div>
                                <div>{space.operatingDays}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            {(space.photos?.length > 0 || space.coverPhoto) && (
                <section style={{
                    background: "#fff",
                    color: "#111",
                    borderRadius: 10,
                    margin: "0 auto",
                    maxWidth: "70vw",
                    padding: 0,
                    marginBottom: 0
                }}>
                    <div style={{ padding: "0 30px" }}>
                        <h4 style={{ margin: "20px 0 8px 0", fontWeight: "bold", fontSize: 16 }}>
                            <i className="bi bi-camera"></i> Photo gallery
                        </h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 10 }}>
                            {space.coverPhoto && (
                                <Image
                                    src={`https://mapacultural.gestorcultural.com.br/uploads/${space.coverPhoto}`}
                                    alt="Cover Photo"
                                    width={160}
                                    height={160}
                                    style={{ borderRadius: 10, objectFit: "cover" }}
                                />
                            )}
                            {space.photos?.map((photo, index) => (
                                <Image
                                    key={index}
                                    src={`https://mapacultural.gestorcultural.com.br/uploads/${photo}`}
                                    alt={`Gallery ${index + 1}`}
                                    width={160}
                                    height={160}
                                    style={{ borderRadius: 10, objectFit: "cover" }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Location */}
            <section style={{
                background: "#fff",
                color: "#111",
                borderRadius: 10,
                margin: "30px auto 0 auto",
                maxWidth: "70vw",
                padding: 0,
                marginBottom: 0
            }}>
                <div style={{ padding: "0 30px" }}>
                    <div className="fw-bold" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <i className="bi bi-geo-alt-fill" style={{ color: '#222', fontSize: 18 }}></i>
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

            {/* Physical Accessibility */}
            {space.accessibility && (
                <section style={{
                    background: "#fff",
                    color: "#111",
                    borderRadius: 10,
                    margin: "30px auto 0 auto",
                    maxWidth: "70vw",
                    padding: "0 30px",
                    marginBottom: 30
                }}>
                    <h4 style={{ margin: "20px 0 8px 0", fontWeight: "bold", fontSize: 16 }}>
                        <i className="bi bi-universal-access"></i> Physical Accessibility
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {space.accessibility.adaptedToilets && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Adapted Toilets
                            </div>
                        )}
                        {space.accessibility.accessRamp && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Access Ramp
                            </div>
                        )}
                        {space.accessibility.elevator && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Elevator
                            </div>
                        )}
                        {space.accessibility.tactileSignaling && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Tactile Signaling
                            </div>
                        )}
                        {space.accessibility.adaptedDrinkingFountain && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Adapted Drinking Fountain
                            </div>
                        )}
                        {space.accessibility.handrail && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Handrails
                            </div>
                        )}
                        {space.accessibility.adaptedElevator && (
                            <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: 20, fontSize: 14 }}>
                                Adapted Elevator
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer style={{
                background: "#222",
                color: "#fff",
                padding: "15px 0",
                fontSize: 14,
                borderTop: "4px solid #444",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                marginTop: 40
            }}>
                <span style={{ marginLeft: 30 }}>
                    MAPA CULTURA - © 2025 Todos os direitos reservados
                </span>
                <span style={{ color: "#4af", marginRight: 30 }}>
                    Desenvolvido por Devactiva Tecnologia
                </span>
            </footer>
        </div>
    );
}

export default function SpaceDetailsPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Carregando...
            </div>
        }>
            <SpaceDetailsContent />
        </Suspense>
    );
}