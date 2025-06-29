"use client"
import React, { useState, useEffect } from 'react';
import { useAccountType } from '../accountTypeContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { buildApiUrl } from '../../../config/api';

const ProjectSpaceCard = ({ item, onClose }) => (
  <div className="rounded-4 p-4 h-100 position-relative" style={{ background: '#FFEB69' }}>
    <button onClick={onClose} className="btn position-absolute top-0 end-0 mt-2 me-2 rounded-circle bg-light">
      ✕
    </button>
    <h3 className="fs-5 pb-2 d-flex align-items-center gap-2">
      {item.status === 'approved' && <span className="text-success">●</span>}
      {item.status === 'pending' && <span className="text-warning">●</span>}
      {item.status === 'rejected' && <span className="text-danger">●</span>}
      <span className="fw-bold" style={{ textTransform: 'capitalize' }}>{item.title.toLowerCase()}</span>
    </h3>
    <div className="d-flex justify-content-center align-items-center" style={{ height: '180px' }}>
      <Image
        src={item.coverPhoto ? `http://localhost:4000/uploads/${item.coverPhoto}` : '/images/card.png'}
        alt={item.title}
        width={200}
        height={180}
        className="object-fit-cover rounded-3"
        onError={(e) => {
          e.target.src = '/images/card.png';
        }}
      />
    </div>
  </div>
);

const NewItemCard = ({ onClick }) => (
  <div 
    className="border border-2 border-dashed rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-center"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-2" 
         style={{ width: '60px', height: '60px' }}>
      <span className="fs-2">+</span>
    </div>
    <span className="fs-5">Novo</span>
  </div>
);

const TYPE_DISPLAY = {
  personal: 'Pessoa Física',
  business: 'MEI',
  collective: 'Coletivo'
};

function Home() {
  const { accountType } = useAccountType();
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('agentToken');
        
        const [projectsRes, spacesRes] = await Promise.all([
          fetch(buildApiUrl('/projects'), {
            headers: { 'Authorization': token }
          }),
          fetch(buildApiUrl('/spaces'), {
            headers: { 'Authorization': token }
          })
        ]);

        const projects = await projectsRes.json();
        const spaces = await spacesRes.json();

        const allItems = [
          ...projects.map(p => ({ ...p, itemType: 'project' })),
          ...spaces.map(s => ({ ...s, itemType: 'space' }))
        ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3); // Get only the 3 most recent items to leave space for the New card

        setRecentItems(allItems);
      } catch (error) {
        console.error('Error fetching recent items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleRemoveItem = (itemId) => {
    setRecentItems(prev => prev.filter(item => item._id !== itemId));
  };

  return (
    <Container className="-5">
      {/* Profile Type Section */}
      <div className="">
        <p className="mb-3">Tipo de perfil</p>
        <div className="d-flex gap-2">
          <Button
            className="rounded-5 border-0 text-dark"
            style={{ backgroundColor: '#9FE870', borderColor: '#8BC34A' }}
          >
            {TYPE_DISPLAY[accountType] || ' '}
          </Button>
        </div>
      </div>

      {/* Projects and Spaces Section */}
      <div className="my-4 d-flex justify-content-between align-items-center">
        <h3 className="fw-semibold">Últimos Projetos e Espaços</h3>
        {/* <div>
          <Link href="/projects" className="text-dark text-decoration-underline me-3">
            Ver projetos
          </Link>
          <Link href="/spaces" className="text-dark text-decoration-underline">
            Ver espaços
          </Link>
        </div> */}
      </div>

      {loading ? (
        <div className="text-center py-5">Carregando...</div>
      ) : (
        <Row className="g-3">
          {recentItems.map((item) => (
            <Col key={item._id} md={3}>
              <ProjectSpaceCard
                item={item}
                onClose={() => handleRemoveItem(item._id)}
              />
            </Col>
          ))}
          <Col md={3}>
            <NewItemCard onClick={() => window.location.href = '#'} />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Home;
