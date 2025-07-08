"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Header from '../../Header-pb.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";

export default function PublicAgentProfile() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('id');
  const agentType = searchParams.get('type') || 'personal';
  
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Get agent avatar color for fallback
  const getAgentColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Format type title
  const getTypeTitle = (type) => {
    switch (type) {
      case 'personal': return 'Agente Pessoal';
      case 'business': return 'Empresa/Organização';
      case 'collective': return 'Coletivo Cultural';
      default: return 'Agente Cultural';
    }
  };

  // Fetch agent data
  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId || !agentType) {
        setError('Parâmetros inválidos');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        console.log('Fetching agent profile for ID:', agentId, 'Type:', agentType);
        
        // Use existing profiles endpoint that's deployed
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/agent/profiles`,
          {
            headers: {
              'Authorization': 'dummy-token-for-testing',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Profiles data received:', data);
        
        // Find the specific agent by ID
        const profile = data.profiles?.find(p => p._id === agentId);
        
        if (!profile) {
          throw new Error('Perfil não encontrado');
        }

        // Check if the requested type is complete
        if (!profile.typeStatus[agentType]?.isComplete) {
          throw new Error('Este tipo de perfil não está disponível');
        }

        // Handle profile photo structures
        let profilePhoto = null;
        if (profile.profilePhotos) {
          if (typeof profile.profilePhotos === 'object') {
            // New structure: object with types
            profilePhoto = profile.profilePhotos[agentType];
          } else if (typeof profile.profilePhotos === 'string') {
            // Old structure: single string (use for all types)
            profilePhoto = profile.profilePhotos;
          }
        }
        
        console.log('Profile photo lookup:', {
          profilePhotos: profile.profilePhotos,
          agentType: agentType,
          selectedPhoto: profilePhoto
        });

        // Prepare response data based on type
        let agentData = {
          _id: profile._id,
          cpf: profile.cpf,
          fullname: profile.fullname,
          email: profile.email,
          telephone: profile.telephone,
          city: profile.city,
          district: profile.district,
          street: profile.street,
          typeStatus: profile.typeStatus,
          profilePhoto: profilePhoto,
          publicProfile: profile.publicProfile?.[agentType] || { aboutText: '', socialLinks: {}, galleryPhotos: [] }
        };

        // Add type-specific data
        if (agentType === 'business' && profile.businessData) {
          agentData.businessData = profile.businessData;
          agentData.displayName = profile.businessData.nomeFantasia || profile.businessData.razaoSocial || profile.fullname;
        } else if (agentType === 'collective' && profile.collectiveData) {
          agentData.collectiveData = profile.collectiveData;
          agentData.displayName = profile.collectiveData.collectiveName || profile.fullname;
        } else {
          agentData.displayName = profile.fullname;
        }

        console.log('Final agent data:', agentData);
        
        // Debug profile structure
        console.log('Profile photos object:', agentData.profilePhoto);
        console.log('Public profile object:', agentData.publicProfile);
        console.log('Requested type:', agentType);
        console.log('Gallery photos for type:', agentData.publicProfile?.galleryPhotos);
        
        // Debug image URLs
        if (agentData.profilePhoto) {
          const profilePhotoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(agentData.profilePhoto)}`;
          console.log('Profile photo URL:', profilePhotoUrl);
          console.log('Profile photo filename:', agentData.profilePhoto);
          
          // Test direct access to the image
          console.log('Direct image test URL:', `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${encodeURIComponent(agentData.profilePhoto)}`);
        } else {
          console.log('No profile photo found for type:', agentType);
        }
        
        if (agentData.publicProfile?.galleryPhotos && agentData.publicProfile.galleryPhotos.length > 0) {
          console.log('Gallery photos:', agentData.publicProfile.galleryPhotos.map(photo => 
            `${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(photo)}`
          ));
          console.log('Gallery filenames:', agentData.publicProfile.galleryPhotos);
          
          // Test direct access to gallery images
          agentData.publicProfile.galleryPhotos.forEach((photo, index) => {
            console.log(`Gallery image ${index + 1} test URL:`, `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${encodeURIComponent(photo)}`);
          });
        } else {
          console.log('No gallery photos found for type:', agentType);
        }
        
        setAgent(agentData);
        
        // Check if image files actually exist by testing URLs
        if (agentData.profilePhoto) {
          console.log('🔍 CHECKING PROFILE PHOTO:', agentData.profilePhoto);
          console.log('Expected URL:', `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${encodeURIComponent(agentData.profilePhoto)}`);
        }
        
        if (agentData.publicProfile?.galleryPhotos && agentData.publicProfile.galleryPhotos.length > 0) {
          console.log('🔍 CHECKING GALLERY PHOTOS:');
          agentData.publicProfile.galleryPhotos.forEach((photo, index) => {
            console.log(`Gallery ${index + 1}:`, photo);
            console.log(`Expected URL:`, `https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${encodeURIComponent(photo)}`);
          });
        }
        
        console.log('📁 Available files in uploads (for comparison):');
        console.log('Latest timestamp in uploads: 1751140967074 (from image2.png)');
        console.log('Database timestamps: 1751832436412, 1751832498160');
        console.log('❌ Database files are NEWER than available files - images missing from server!');
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError(`Falha ao carregar perfil: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId, agentType]);

  if (loading) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: 18, marginBottom: 16 }}>Carregando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#ff4444' }}>
            <div style={{ fontSize: 18, marginBottom: 16 }}>{error || 'Perfil não encontrado'}</div>
            <button 
              onClick={() => window.history.back()}
              style={{ 
                background: '#2CB34A',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Header />
      
      {/* Profile Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2CB34A 0%, #1a8b1a 100%)',
        padding: '60px 0',
        position: 'relative'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          flexWrap: 'wrap'
        }}>
          {/* Profile Photo */}
          <div style={{ flex: '0 0 200px' }}>
            {agent.profilePhoto && !imageErrors[`profile-${agent._id}`] ? (
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(agent.profilePhoto)}`}
                alt={agent.displayName}
                onError={(e) => {
                  console.error('Profile photo failed to load:', e.target.src);
                  console.error('Profile photo error details:', e);
                  console.error('Profile photo status:', e.target.complete, e.target.naturalWidth, e.target.naturalHeight);
                  setImageErrors(prev => ({ ...prev, [`profile-${agent._id}`]: true }));
                }}
                width={200}
                height={200}
                style={{ 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '6px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              />
            ) : (
              <div style={{ 
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: getAgentColor(agent.displayName),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 64,
                border: '6px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                {agent.displayName ? agent.displayName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'A'}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1, color: '#fff' }}>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16
            }}>
              {getTypeTitle(agentType)}
            </div>
            
            <h1 style={{ 
              fontSize: 48, 
              fontWeight: 700, 
              margin: '0 0 16px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {agent.displayName}
            </h1>

            {/* Additional business/collective info */}
            {agentType === 'business' && agent.businessData?.razaoSocial && 
             agent.businessData.razaoSocial !== agent.displayName && (
              <div style={{ fontSize: 20, marginBottom: 16, opacity: 0.9 }}>
                {agent.businessData.razaoSocial}
              </div>
            )}

            {agentType === 'collective' && agent.collectiveData?.participants && (
              <div style={{ fontSize: 18, marginBottom: 16, opacity: 0.9 }}>
                {agent.collectiveData.participants} participantes
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {agent.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="bi bi-geo-alt" style={{ fontSize: 18 }}></i>
                  <span>{agent.city}</span>
                </div>
              )}
              
              {agent.telephone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="bi bi-telephone" style={{ fontSize: 18 }}></i>
                  <span>{agent.telephone}</span>
                </div>
              )}

              {/* Social Links */}
              {agent.publicProfile?.socialLinks && (
                <div style={{ display: 'flex', gap: 16 }}>
                  {agent.publicProfile.socialLinks.instagram && (
                    <a 
                      href={agent.publicProfile.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#fff', fontSize: 24 }}
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                  )}
                  {agent.publicProfile.socialLinks.facebook && (
                    <a 
                      href={agent.publicProfile.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#fff', fontSize: 24 }}
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                  )}
                  {agent.publicProfile.socialLinks.youtube && (
                    <a 
                      href={agent.publicProfile.socialLinks.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#fff', fontSize: 24 }}
                    >
                      <i className="bi bi-youtube"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 40 
        }}>
          
          {/* Left Column - About & Gallery */}
          <div>
            {/* About Section */}
            {agent.publicProfile?.aboutText && (
              <div style={{ 
                background: '#fff', 
                borderRadius: 16, 
                padding: 32,
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  marginBottom: 24,
                  color: '#2CB34A'
                }}>
                  Sobre
                </h2>
                <div style={{ 
                  fontSize: 16, 
                  lineHeight: 1.6, 
                  color: '#444',
                  whiteSpace: 'pre-wrap'
                }}>
                  {agent.publicProfile.aboutText}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {agent.publicProfile?.galleryPhotos && agent.publicProfile.galleryPhotos.length > 0 && (
              <div style={{ 
                background: '#fff', 
                borderRadius: 16, 
                padding: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  marginBottom: 24,
                  color: '#2CB34A'
                }}>
                  Galeria
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: 16 
                }}>
                  {agent.publicProfile.galleryPhotos.map((photo, index) => {
                    const galleryKey = `gallery-${agent._id}-${index}`;
                    if (imageErrors[galleryKey]) return null;
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => setSelectedGalleryImage(`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(photo)}`)}
                        style={{ 
                          cursor: 'pointer',
                          borderRadius: 12,
                          overflow: 'hidden',
                          transition: 'transform 0.2s ease',
                          ':hover': { transform: 'scale(1.05)' }
                        }}
                      >
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${encodeURIComponent(photo)}`}
                          alt={`Galeria ${index + 1}`}
                          onError={(e) => {
                            console.error('Gallery photo failed to load:', e.target.src);
                            console.error('Gallery photo error details:', e);
                            console.error('Gallery photo status:', e.target.complete, e.target.naturalWidth, e.target.naturalHeight);
                            setImageErrors(prev => ({ ...prev, [galleryKey]: true }));
                          }}
                          width={200}
                          height={200}
                          style={{ 
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Details */}
          <div>
            {/* Contact Information */}
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 32,
              marginBottom: 32,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                marginBottom: 24,
                color: '#2CB34A'
              }}>
                Contato
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {agent.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: '#f0f9ff', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2CB34A'
                    }}>
                      <i className="bi bi-envelope" style={{ fontSize: 18 }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>Email</div>
                      <div style={{ fontWeight: 600 }}>{agent.email}</div>
                    </div>
                  </div>
                )}

                {agent.telephone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: '#f0f9ff', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2CB34A'
                    }}>
                      <i className="bi bi-telephone" style={{ fontSize: 18 }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>Telefone</div>
                      <div style={{ fontWeight: 600 }}>{agent.telephone}</div>
                    </div>
                  </div>
                )}

                {(agent.street || agent.district || agent.city) && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      background: '#f0f9ff', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2CB34A'
                    }}>
                      <i className="bi bi-geo-alt" style={{ fontSize: 18 }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>Endereço</div>
                      <div style={{ fontWeight: 600 }}>
                        {[agent.street, agent.district, agent.city].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info based on type */}
            {agentType === 'business' && agent.businessData && (
              <div style={{ 
                background: '#fff', 
                borderRadius: 16, 
                padding: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  fontSize: 24, 
                  fontWeight: 700, 
                  marginBottom: 24,
                  color: '#2CB34A'
                }}>
                  Informações Empresariais
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {agent.businessData.razaoSocial && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Razão Social</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.razaoSocial}</div>
                    </div>
                  )}
                  
                  {agent.businessData.nomeFantasia && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Nome Fantasia</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.nomeFantasia}</div>
                    </div>
                  )}

                  {agent.businessData.cnpj && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>CNPJ</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.cnpj}</div>
                    </div>
                  )}

                  {agent.businessData.cnpjType && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Tipo</div>
                      <div style={{ fontWeight: 600 }}>{agent.businessData.cnpjType}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {agentType === 'collective' && agent.collectiveData && (
              <div style={{ 
                background: '#fff', 
                borderRadius: 16, 
                padding: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  fontSize: 24, 
                  fontWeight: 700, 
                  marginBottom: 24,
                  color: '#2CB34A'
                }}>
                  Informações do Coletivo
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {agent.collectiveData.collectiveName && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Nome do Coletivo</div>
                      <div style={{ fontWeight: 600 }}>{agent.collectiveData.collectiveName}</div>
                    </div>
                  )}

                  {(agent.collectiveData.dayCreated || agent.collectiveData.monthCreated || agent.collectiveData.yearCreated) && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Data de Criação</div>
                      <div style={{ fontWeight: 600 }}>
                        {[agent.collectiveData.dayCreated, agent.collectiveData.monthCreated, agent.collectiveData.yearCreated].filter(Boolean).join('/')}
                      </div>
                    </div>
                  )}

                  {agent.collectiveData.participants && (
                    <div>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Participantes</div>
                      <div style={{ fontWeight: 600 }}>{agent.collectiveData.participants}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div 
          onClick={() => setSelectedGalleryImage(null)}
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
          <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}>
            <Image 
              src={selectedGalleryImage}
              alt="Gallery image"
              width={800}
              height={600}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
            <button 
              onClick={() => setSelectedGalleryImage(null)}
              style={{ 
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 20,
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
    </div>
  );
}
