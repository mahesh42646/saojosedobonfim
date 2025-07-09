"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Headerpb from "../Header-pb";
import { buildApiUrl } from '../config/api';
import Link from 'next/link';

// Base URL for images (without /api)
const IMAGE_BASE_URL = 'https://mapacultural.saojosedobonfim.pb.gov.br';

export default function CulturalAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'list', 'grid', or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Get agent type status - Updated to return primary type only
  const getAgentType = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'Personal';
    if (agent.typeStatus?.business?.isComplete) return 'Business';
    if (agent.typeStatus?.collective?.isComplete) return 'Collective';
    return 'Incomplete';
  };

  // Get agent display name based on primary type
  const getAgentDisplayName = (agent) => {
    const type = getAgentType(agent);
    switch (type) {
      case 'Business':
        return agent.businessData?.nomeFantasia || agent.businessData?.razaoSocial || agent.fullname || 'Unnamed Business';
      case 'Collective':
        return agent.collectiveData?.collectiveName || agent.fullname || 'Unnamed Collective';
      case 'Personal':
      case 'Incomplete':
      default:
        return agent.fullname || 'Unnamed Agent';
    }
  };

  // Get agent profile photo based on primary type
  const getAgentProfilePhoto = (agent) => {
    const type = getAgentType(agent);
    switch (type) {
      case 'Personal':
        return agent.profilePhotos?.personal;
      case 'Business':
        return agent.profilePhotos?.business;
      case 'Collective':
        return agent.profilePhotos?.collective;
      default:
        return null;
    }
  };

  // Get profile type info for display
  const getProfileTypeInfo = (agent) => {
    const type = getAgentType(agent);
    switch (type) {
      case 'Personal':
        return {
          type: 'Personal',
          title: 'Conta Pessoal',
          description: 'Perfil de agente cultural individual'
        };
      case 'Business':
        return {
          type: 'Business',
          title: 'Conta Empresarial',
          description: 'Perfil cultural de empresa ou organização'
        };
      case 'Collective':
        return {
          type: 'Collective',
          title: 'Conta Coletiva',
          description: 'Iniciativa cultural de grupo ou coletivo'
        };
      default:
        return {
          type: 'Incomplete',
          title: 'Perfil Incompleto',
          description: 'Configuração de perfil não concluída'
        };
    }
  };

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = buildApiUrl('/agent/profiles?status=active');
      const response = await fetch(url, {
        headers: {
          'Authorization': 'dummy-token-for-testing',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgents(data.profiles || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and paginate agents
  const filteredAgents = agents.filter(agent => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = getAgentDisplayName(agent).toLowerCase().includes(searchLower);
    const typeMatch = getAgentType(agent).toLowerCase().includes(searchLower) ||
                     getProfileTypeInfo(agent).description.toLowerCase().includes(searchLower);
    return nameMatch || typeMatch;
  });

  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * agentsPerPage,
    currentPage * agentsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const renderAgentCard = (agent) => {
    const profilePhoto = getAgentProfilePhoto(agent);
    const displayName = getAgentDisplayName(agent);
    const profileType = getProfileTypeInfo(agent);
    
    if (viewMode === 'grid') {
      return (
        <div key={agent._id} style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20,
          boxShadow: '0 0 8px 0 #0001',
          width: 'calc(33.33% - 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center'
        }}>
          {profilePhoto ? (
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto}`}
              alt={displayName}
              width={200}
              height={200}
              unoptimized
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: getAgentColor(agent),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 64
            }}>
              {(displayName || 'A').split(' ').length > 1 
                ? (displayName || 'A').split(' ').map(n => n[0]).join('') 
                : (displayName || 'A')[0]}
            </div>
          )}
          <div style={{ overflow: 'hidden', textAlign: 'center', width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              {displayName}
              {profileType.type === 'Business' && agent.businessData?.razaoSocial && (
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                  {agent.businessData.razaoSocial}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: '#2CB34A', fontWeight: 600 }}>
                {profileType.title}
              </div>
              {/* <div style={{ fontSize: 12, color: '#666' }}>
                {profileType.description}
              </div> */}
            </div>
            <div style={{ color: '#F2994A', fontSize: 18, marginTop: 2 }}>★★★★★</div>
            <Link 
              href={`/Agentes-Culturais/${agent._id}?type=${getAgentType(agent).toLowerCase()}`}
              style={{ 
                background: '#2CB34A',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: 16
              }}
            >
               Conhecer
            </Link>
          </div>
        </div>
      );
    }

    if (viewMode === 'map') {
      return (
        <div key={agent._id} style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 16,
          boxShadow: '0 0 8px 0 #0001',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16
        }}>
          {profilePhoto ? (
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto}`}
              alt={displayName}
              width={100}
              height={100}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: getAgentColor(agent),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 32
            }}>
              {(displayName || 'A').split(' ').length > 1 
                ? (displayName || 'A').split(' ').map(n => n[0]).join('') 
                : (displayName || 'A')[0]}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {displayName}
              {profileType.type === 'Business' && agent.businessData?.razaoSocial && (
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                  {agent.businessData.razaoSocial}
                </div>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, color: '#2CB34A', fontWeight: 600 }}>
                {profileType.title}
              </div>
              {/* <div style={{ fontSize: 12, color: '#666' }}>
                {profileType.description}
              </div> */}
            </div>
            <div style={{ color: '#F2994A', fontSize: 18, marginTop: 2 }}>★★★★★</div>
          </div>
          <Link 
            href={`/Agentes-Culturais/${agent._id}?type=${getAgentType(agent).toLowerCase()}`}
            style={{ 
              background: '#2CB34A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'none',
              alignSelf: 'flex-start'
            }}
          >
             Conhecer
          </Link>
        </div>
      );
    }

    // List view (default)
    return (
      <div key={agent._id} style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 24, 
        background: '#fff', 
        borderRadius: 16, 
        padding: 24, 
        boxShadow: '0 0 8px 0 #0001' 
      }}>
        {profilePhoto ? (
          <Image 
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto}`}
            alt={displayName}
            width={150}
            height={150}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
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
            fontSize: 48
          }}>
            {(displayName || 'A').split(' ').length > 1 
              ? (displayName || 'A').split(' ').map(n => n[0]).join('') 
              : (displayName || 'A')[0]}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div className="pt-2" style={{ fontWeight: 700, fontSize: 22 }}>
            {displayName}
            {/* {profileType.type === 'Business' && agent.businessData?.razaoSocial && (
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                {agent.businessData.razaoSocial}
              </div>
            )} */}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, color: '#2CB34A', fontWeight: 600 }}>
              {profileType.title}
            </div>
            {/* <div style={{ fontSize: 13, color: '#666' }}>
              {profileType.description}
            </div> */}
          </div>
          <div style={{ color: '#F2994A', fontSize: 18, marginTop: 8 }}>★★★★★</div>
        </div>
        <Link 
          href={`/Agentes-Culturais/${agent._id}?type=${getAgentType(agent).toLowerCase()}`}
          style={{ 
            background: '#2CB34A',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            alignSelf: 'flex-start',
            boxShadow: '0 2px 8px #2CB34A44',
            textDecoration: 'none'
          }}
        >
           Conhecer
        </Link>
      </div>
    );
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <Headerpb />
      <div style={{ position: 'relative', width: '100%', height: 334, overflow: 'visible', borderBottomLeftRadius: 2, borderBottomRightRadius: 32, marginBottom: 0 }}>
        <Image src="/images/projectsBG.png" alt="Banner" width={100} height={100} style={{ objectFit: 'cover', width: '100%', height: '334px', objectPosition: 'end' }} />
        {/* Green overlay gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderBottomLeftRadius: 2, borderBottomRightRadius: 32,
            background: 'linear-gradient(88.74deg, rgb(47, 127, 45) 20%, rgba(26, 139, 26, 0.15) 100%)', }} /> {/* Text */}
        <div style={{ position: 'absolute', top: 120, left: '15%', color: '#fff', zIndex: 2 }}>
          {/* <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>BEM VINDO AOS</div> */}
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Agentes Culturais</div>
        </div>
        {/* Bottom image border */}
        <div style={{ position: 'absolute', left: 0, bottom: -24, width: '100%', height: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden', zIndex: 3 }}>
          <Image src="/images/banner_bottom.jpg" className="img-fluid" style={{ opacity: 0.9, background: 'rgba(187, 0, 0, 0)' }} alt="Banner Border" fill />
        </div>
      </div>

      {/* View options and search */}
      <div className="container d-lg-flex gap-2 px-lg-0 px-5 w-100" style={{  margin: '48px auto 0',  alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 500, color: '#888' }}>Visualizar como</span>
          <span 
            onClick={() => setViewMode('list')}
            style={{ 
              color: viewMode === 'list' ? '#2CB34A' : '#888', 
              fontWeight: viewMode === 'list' ? 600 : 400,
              borderBottom: viewMode === 'list' ? '2px solid #2CB34A' : 'none',
              paddingBottom: 2,
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-list"></i> Lista
          </span>
          <span 
            onClick={() => setViewMode('grid')}
            style={{ 
              color: viewMode === 'grid' ? '#2CB34A' : '#888',
              fontWeight: viewMode === 'grid' ? 600 : 400,
              borderBottom: viewMode === 'grid' ? '2px solid #2CB34A' : 'none',
              paddingBottom: 2,
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-grid"></i> Grade
          </span>
          <span 
            onClick={() => setViewMode('map')}
            style={{ 
              color: viewMode === 'map' ? '#2CB34A' : '#888',
              fontWeight: viewMode === 'map' ? 600 : 400,
              borderBottom: viewMode === 'map' ? '2px solid #2CB34A' : 'none',
              paddingBottom: 2,
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-map"></i> Mapa
          </span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar agente cultural"
          style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', width: 400 }}
        />
      </div>

      {/* Agent cards */}
      <div style={{ 
        maxWidth: 1000, 
        margin: '32px auto 0', 
        display: 'flex', 
        flexDirection: viewMode === 'grid' ? 'row' : 'column',
        flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap',
        gap: 24,
        padding: '0 16px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', width: '100%' }}>
            Carregando agentes...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444', width: '100%' }}>
            {error}
            <button 
              onClick={fetchAgents}
              style={{ 
                marginLeft: 16,
                background: '#7CFC00',
                border: 'none',
                borderRadius: 16,
                padding: '8px 16px',
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : paginatedAgents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', width: '100%' }}>
            Nenhum agente encontrado.
          </div>
        ) : (
          paginatedAgents.map(agent => renderAgentCard(agent))
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredAgents.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '32px 0' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 8, 
                border: 'none', 
                background: currentPage === page ? '#2CB34A' : '#F4F4F4',
                color: currentPage === page ? '#fff' : '#222',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
