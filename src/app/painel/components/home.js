"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { buildApiUrl } from "../../config/api";

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const [projectsRes, spacesRes] = await Promise.all([
          fetch(buildApiUrl('/admin/projects')),
          fetch(buildApiUrl('/admin/spaces'))
        ]);

        const projects = await projectsRes.json();
        const spaces = await spacesRes.json();

        // Combine and sort projects and spaces by creation date
        const allItems = [
          ...projects.map(p => ({ ...p, itemType: 'project' })),
          ...spaces.map(s => ({ ...s, itemType: 'space' }))
        ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRecentItems(allItems);
      } catch (error) {
        console.error('Error fetching recent items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  // Filter items based on selected type
  const filteredItems = selectedType === 'all' 
    ? recentItems.slice(0, 4)
    : recentItems.filter(item => item.itemType === selectedType).slice(0, 4);

  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-3 mt-lg-2">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold py-2" style={{ fontSize: 22 }}>Últimos Projetos e Espaços</h2>
        <div className="position-relative">
          <button 
            className="btn rounded-5 px-4 py-2"
            style={{ background: '#F5FFF0', border: '1px solid rgb(216, 251, 216)' }}
            onClick={() => setShowFilter(!showFilter)}
          >
            Filtrar por Tipo <i className="bi bi-chevron-down ms-2"></i>
          </button>
          {showFilter && (
            <div 
              className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-sm"
              style={{ 
                zIndex: 1000,
                minWidth: '200px',
                border: '1px solid #eee'
              }}
            >
              <div 
                className="px-3 py-2 cursor-pointer hover-bg-light"
                onClick={() => {
                  setSelectedType('all');
                  setShowFilter(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                Todos
              </div>
              <div 
                className="px-3 py-2 cursor-pointer hover-bg-light"
                onClick={() => {
                  setSelectedType('project');
                  setShowFilter(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                Projetos
              </div>
              <div 
                className="px-3 py-2 cursor-pointer hover-bg-light"
                onClick={() => {
                  setSelectedType('space');
                  setShowFilter(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                Espaços
              </div>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-5">Carregando...</div>
      ) : (
        <div className="d-flex flex-column flex-lg-row col-12 py-4 pe-lg-5 gap-3">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 col-12 col-lg-3 d-flex flex-column align-items-center rounded-4"
              style={{ background: '#FFEB69' }}
            >
              <div className="text-start w-100 mb-3">
                <div className="d-flex align-items-center gap-2">
                  {item.status === 'approved' && <span className="text-success">●</span>}
                  {item.status === 'pending' && <span className="text-warning">●</span>}
                  {item.status === 'rejected' && <span className="text-danger">●</span>}
                  <span className="fw-semibold fs-18 text-dark">{item.title}</span>
                </div>
                <div className="text-muted mt-1">{item.itemType === 'project' ? 'Projeto' : 
                                                     item.itemType === 'space' ? 'Espaço' : 
                                                     item.itemType === 'agent' ? 'Agente' : 
                                                     item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}</div>
              </div>
              <Image
                src={item.coverPhoto ? `http://localhost:4000/uploads/${item.coverPhoto}` : '/images/card.png'}
                alt={item.title}
                width={144}
                height={144}
                className="object-fit-cover rounded-3"
                onError={(e) => {
                  e.target.src = '/images/card.png';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
