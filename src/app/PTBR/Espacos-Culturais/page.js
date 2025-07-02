"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Headerpb from "../Header-pb";
import { buildApiUrl } from '../../config/api';
import Link from 'next/link';

// Base URL for images (without /api)
const IMAGE_BASE_URL = 'https://mapacultural.gestorcultural.com.br';

export default function CulturalSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const spacesPerPage = 10;

  // Fetch spaces from API
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildApiUrl('/admin/spaces'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      setSpaces(data || []);
    } catch (err) {
      console.error('Erro ao carregar espaços:', err);
      setError('Falha ao carregar espaços. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate spaces
  const filteredSpaces = spaces.filter(space => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = space.title?.toLowerCase().includes(searchLower);
    const descriptionMatch = space.description?.toLowerCase().includes(searchLower);
    return titleMatch || descriptionMatch;
  });

  const totalPages = Math.ceil(filteredSpaces.length / spacesPerPage);
  const paginatedSpaces = filteredSpaces.slice(
    (currentPage - 1) * spacesPerPage,
    currentPage * spacesPerPage
  );

  // Strip HTML tags for display
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Fetch spaces on component mount
  useEffect(() => {
    fetchSpaces();
  }, []);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const renderSpaceCard = (space) => {
    const description = stripHtml(space.description);
    
    if (viewMode === 'grid') {
      return (
        <div key={space._id} style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20,
          boxShadow: '0 0 8px 0 #0001',
          width: 'calc(33.33% - 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {space.coverPhoto ? (
            <Image 
              src={`${IMAGE_BASE_URL}/uploads/${space.coverPhoto}`}
              alt={space.title}
              width={300}
              height={200}
              style={{ borderRadius: 16, objectFit: 'cover', width: '100%', height: 200 }}
            />
          ) : (
            <div style={{ 
              width: '100%',
              height: 200,
              borderRadius: 16,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-building" style={{ fontSize: 32, color: '#888' }}></i>
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{space.title}</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
              {space.address}
            </div>
            <div style={{ fontSize: 15, color: '#222', marginBottom: 16 }}>
              {description?.length > 100 ? `${description.substring(0, 100)}...` : description}
            </div>
            <Link 
              href={`/brejodocruz-pb/espacos?id=${space._id}`}
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
                display: 'inline-block'
              }}
            >
              + Conhecer
            </Link>
          </div>
        </div>
      );
    }

    if (viewMode === 'map') {
      return (
        <div key={space._id} style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 16,
          boxShadow: '0 0 8px 0 #0001',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{ width: 100, height: 100, flexShrink: 0 }}>
            {space.coverPhoto ? (
              <Image 
                src={`${IMAGE_BASE_URL}/uploads/${space.coverPhoto}`}
                alt={space.title}
                width={100}
                height={100}
                style={{ borderRadius: 8, objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: 100,
                height: 100,
                borderRadius: 8,
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-building" style={{ fontSize: 24, color: '#888' }}></i>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{space.title}</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {space.address}
            </div>
          </div>
          <Link 
            href={`/brejodocruz-pb/espacos?id=${space._id}`}
            style={{ 
              background: '#2CB34A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            + Conhecer
          </Link>
        </div>
      );
    }

    // List view (default)
    return (
      <div key={space._id} style={{ display: 'flex', alignItems: 'flex-start', background: '#fff', borderRadius: 16, padding: 24, gap: 24, boxShadow: '0 0 8px 0 #0001' }}>
        {space.coverPhoto ? (
          <Image 
            src={`${IMAGE_BASE_URL}/uploads/${space.coverPhoto}`}
            alt={space.title}
            width={150}
            height={150}
            style={{ borderRadius: 16, objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: 150,
            height: 150,
            borderRadius: 16,
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-building" style={{ fontSize: 32, color: '#888' }}></i>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{space.title}</div>
          <div style={{ fontSize: 14, color: '#888', margin: '4px 0 8px 0' }}>
            {space.address}
          </div>
          <div style={{ fontSize: 15, color: '#222' }}>
            {description?.length > 200 ? `${description.substring(0, 200)}...` : description}
          </div>
        </div>
        <Link 
          href={`/brejodocruz-pb/espacos?id=${space._id}`}
          style={{ 
            background: '#2CB34A',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            alignSelf: 'center',
            boxShadow: '0 2px 8px #2CB34A44',
            textDecoration: 'none'
          }}
        >
          + Conhecer
        </Link>
      </div>
    );
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <Headerpb />
      <div style={{ position: 'relative', width: '100%', height: 334, overflow: 'visible', borderBottomLeftRadius: 2, borderBottomRightRadius: 32, marginBottom: 0 }}>
        <Image src="/images/projectsBG.png" alt="Banner" width={100} height={100} style={{ objectFit: 'cover', width: '80%', height: '334px', objectPosition: 'end', marginLeft: '20%' }} />
        {/* Green overlay gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderBottomLeftRadius: 2, borderBottomRightRadius: 32,
            background: 'linear-gradient(88.74deg, rgb(47, 127, 45) 20%, rgba(26, 139, 26, 0.15) 100%)', }} /> {/* Text */}
        <div style={{ position: 'absolute', top: 120, left: '15%', color: '#fff', zIndex: 2 }}>
          {/* <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>BEM VINDO AOS</div> */}
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Espaços Culturais</div>
        </div>
        {/* Bottom image border */}
        <div style={{ position: 'absolute', left: 0, bottom: -24, width: '100%', height: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden', zIndex: 3 }}>
          <Image src="/images/banner_bottom.jpg" className="img-fluid" style={{ opacity: 0.9, background: 'rgba(187, 0, 0, 0)' }} alt="Banner Border" fill />
        </div>
      </div>

      {/* View options and search */}
      <div style={{ maxWidth: 1000, margin: '32px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
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
          placeholder="Pesquisar espaço cultural"
          style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', width: 400 }}
        />
      </div>

      {/* Space cards */}
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
            Carregando espaços...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444', width: '100%' }}>
            {error}
            <button 
              onClick={fetchSpaces}
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
        ) : paginatedSpaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', width: '100%' }}>
            Nenhum espaço encontrado.
          </div>
        ) : (
          paginatedSpaces.map(space => renderSpaceCard(space))
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredSpaces.length > 0 && (
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
