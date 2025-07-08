"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Headerpb from "../../Header-pb";
import { buildApiUrl } from '../../config/api';

const IMAGE_BASE_URL = 'https://mapacultural.saojosedobonfim.pb.gov.br';

export default function AgentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.id;
  const agentType = searchParams.get('type') || 'personal';
  
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);

  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent?.displayName?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = buildApiUrl(`/agent/profile/${agentId}/public?type=${agentType}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgent(data);
    } catch (err) {
      console.error('Error fetching agent details:', err);
      setError('Failed to load agent details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentDetails();
    }
  }, [agentId, agentType]);

  if (loading) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Headerpb />
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Carregando perfil do agente...</div>
          <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #2CB34A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Headerpb />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ color: '#ff4444', fontSize: 18, marginBottom: 16 }}>
            {error || 'Agente não encontrado'}
          </div>
          <Link 
            href="/Agentes-Culturais"
            style={{ 
              background: '#2CB34A',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Voltar para Agentes
          </Link>
        </div>
      </div>
    );
  }

  const profilePhoto = agent.profilePhoto;
  // Use flattened structure from API response
  const aboutText = agent.aboutText || '';
  const socialLinks = agent.socialLinks || {};
  const galleryPhotos = agent.galleryPhotos || [];
  
  // Debug log to check data
  console.log('Agent data:', agent);
  console.log('Agent type:', agentType);
  console.log('About text:', aboutText);
  console.log('Social links:', socialLinks);
  console.log('Gallery photos:', galleryPhotos);

  const getTypeInfo = () => {
    switch (agentType) {
      case 'business':
        return {
          title: 'Perfil Empresarial',
          icon: '🏢',
          color: '#1E88E5'
        };
      case 'collective':
        return {
          title: 'Perfil Coletivo',
          icon: '👥',
          color: '#8E24AA'
        };
      default:
        return {
          title: 'Perfil Pessoal',
          icon: '👤',
          color: '#2CB34A'
        };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Headerpb />
      
      {/* Hero Section */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #2CB34A 0%, #1E88E5 100%)', padding: '60px 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 100, height: 100, borderRadius: '50%', background: '#fff' }}></div>
          <div style={{ position: 'absolute', top: '60%', right: '15%', width: 60, height: 60, borderRadius: '50%', background: '#fff' }}></div>
          <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: 80, height: 80, borderRadius: '50%', background: '#fff' }}></div>
        </div>
        
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          <Link 
            href="/Agentes-Culturais"
            style={{ 
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 32
            }}
          >
            ← Voltar para Agentes Culturais
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            {profilePhoto ? (
              <Image 
                src={`${IMAGE_BASE_URL}/uploads/${profilePhoto}`}
                alt={agent.displayName}
                width={150}
                height={150}
                style={{ 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              />
            ) : (
              <div style={{ 
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: getAgentColor(agent),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 48,
                border: '4px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                {agent.displayName?.split(' ').length > 1 
                  ? agent.displayName.split(' ').map(n => n[0]).join('') 
                  : (agent.displayName || 'A')[0]}
              </div>
            )}
            
            <div style={{ flex: 1, color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{typeInfo.icon}</span>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '4px 12px', 
                  borderRadius: 20, 
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  {typeInfo.title}
                </span>
              </div>
              
              <h1 style={{ fontSize: 48, fontWeight: 700, margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {agent.displayName}
              </h1>
              
              {agentType === 'business' && agent.businessData?.razaoSocial && agent.businessData.razaoSocial !== agent.displayName && (
                <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>
                  {agent.businessData.razaoSocial}
                </div>
              )}
              
              {agentType === 'collective' && agent.collectiveData?.participants && (
                <div style={{ fontSize: 16, opacity: 0.9 }}>
                  {agent.collectiveData.participants} participantes
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
                <div style={{ fontSize: 20 }}>★★★★★</div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  {agent.city && `${agent.city}, PB`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
          
          {/* Left Column - Main Info */}
          <div>
            {/* About Section */}
            {aboutText && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#333' }}>
                  Sobre {agentType === 'collective' ? 'o Coletivo' : agentType === 'business' ? 'a Empresa' : 'o Agente'}
                </h2>
                <div style={{ 
                  fontSize: 16, 
                  lineHeight: 1.7, 
                  color: '#666',
                  background: '#f8f9fa',
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid #e9ecef'
                }}>
                  {aboutText}
                </div>
              </div>
            )}

            {/* Business/Collective Specific Info */}
            {agentType === 'business' && agent.businessData && (
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                  Informações Empresariais
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                  {agent.businessData.cnpj && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>CNPJ</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.cnpj}</div>
                    </div>
                  )}
                  {agent.businessData.razaoSocial && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Razão Social</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.razaoSocial}</div>
                    </div>
                  )}
                  {agent.businessData.nomeFantasia && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Nome Fantasia</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.nomeFantasia}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {agentType === 'collective' && agent.collectiveData && (
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                  Informações do Coletivo
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                  {agent.collectiveData.collectiveName && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Nome do Coletivo</div>
                      <div style={{ fontWeight: 600 }}>{agent.collectiveData.collectiveName}</div>
                    </div>
                  )}
                  {(agent.collectiveData.dayCreated || agent.collectiveData.monthCreated || agent.collectiveData.yearCreated) && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Data de Criação</div>
                      <div style={{ fontWeight: 600 }}>
                        {[agent.collectiveData.dayCreated, agent.collectiveData.monthCreated, agent.collectiveData.yearCreated].filter(Boolean).join('/')}
                      </div>
                    </div>
                  )}
                  {agent.collectiveData.participants && (
                    <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Participantes</div>
                      <div style={{ fontWeight: 600 }}>{agent.collectiveData.participants}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {galleryPhotos.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                  Galeria de Fotos
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: 16 
                }}>
                  {galleryPhotos.map((photo, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedGalleryPhoto(photo)}
                      style={{ 
                        cursor: 'pointer',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease',
                        ':hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      <Image 
                        src={`${IMAGE_BASE_URL}/uploads/${photo}`}
                        alt={`Galeria ${index + 1}`}
                        width={200}
                        height={200}
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover' 
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Social */}
          <div style={{ position: 'sticky', top: 40 }}>
            {/* Contact Info */}
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e9ecef', 
              borderRadius: 16, 
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                Informações de Contato
              </h3>
              
              {agent.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>📧</span>
                  <div>
                    <div style={{ fontSize: 14, color: '#666' }}>Email</div>
                    <div style={{ fontWeight: 500 }}>{agent.email}</div>
                  </div>
                </div>
              )}
              
              {agent.telephone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>📱</span>
                  <div>
                    <div style={{ fontSize: 14, color: '#666' }}>Telefone</div>
                    <div style={{ fontWeight: 500 }}>{agent.telephone}</div>
                  </div>
                </div>
              )}
              
              {(agent.street || agent.district || agent.city) && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 14, color: '#666' }}>Endereço</div>
                    <div style={{ fontWeight: 500, lineHeight: 1.4 }}>
                      {[agent.street, agent.district, agent.city].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(socialLinks.instagram || socialLinks.facebook || socialLinks.youtube) && (
              <div style={{ 
                background: '#fff', 
                border: '1px solid #e9ecef', 
                borderRadius: 16, 
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                  Redes Sociais
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {socialLinks.instagram && (
                    <a 
                      href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        borderRadius: 8,
                        background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      <span style={{ fontSize: 20 }}>📷</span>
                      Instagram
                    </a>
                  )}
                  
                  {socialLinks.facebook && (
                    <a 
                      href={socialLinks.facebook.startsWith('http') ? socialLinks.facebook : `https://facebook.com/${socialLinks.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        borderRadius: 8,
                        background: '#1877f2',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      <span style={{ fontSize: 20 }}>👤</span>
                      Facebook
                    </a>
                  )}
                  
                  {socialLinks.youtube && (
                    <a 
                      href={socialLinks.youtube.startsWith('http') ? socialLinks.youtube : `https://youtube.com/${socialLinks.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        borderRadius: 8,
                        background: '#ff0000',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      <span style={{ fontSize: 20 }}>🎥</span>
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedGalleryPhoto && (
        <div 
          onClick={() => setSelectedGalleryPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <Image 
              src={`${IMAGE_BASE_URL}/uploads/${selectedGalleryPhoto}`}
              alt="Foto ampliada"
              width={800}
              height={600}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: 8
              }}
            />
            <button
              onClick={() => setSelectedGalleryPhoto(null)}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fff',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 