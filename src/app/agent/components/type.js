import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const accountTypes = [
  {
    key: 'collective',
    title: 'Conta Coletiva',
    subtitle: 'Você pode adicionar outro perfil depois',
    img: '/images/Collective.png', // Replace with your actual image path
  },
  {
    key: 'personal',
    title: 'Conta Pessoal',
    subtitle: 'Você pode adicionar outro perfil depois',
    img: '/images/Personal.png', // Replace with your actual image path
  },
  {
    key: 'business',
    title: 'Conta Empresarial',
    subtitle: 'Você pode adicionar outro perfil depois',
    img: '/images/Business.png', // Replace with your actual image path
  },
];

export default function Type({ onSelectType }) {
  return (
    <>
      <div className="container py-2 border-0" style={{ background: '#fff' }}>
        <div className="d-flex align-items-center justify-content-between">
          {/* Left: Logo and Text */}
          <div className="d-flex align-items-center">
            <Image src="/images/MadminLogo.jpg" alt="Gestor Cultural Logo" width={160} height={50} style={{ marginRight: 8 }} />

          </div>
          {/* Right: Icons */}
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ background: '#D9DED9', width: 48, height: 48 }}>
              {/* Calendar Icon (placeholder SVG) */}
              <svg width="24" height="24" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <span className="d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, cursor: 'pointer' }}>
              {/* Close Icon (X, placeholder SVG) */}
              <svg width="28" height="28" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <Container className="p-lg-5">
        <h2 className="fw-bold text-center mb-2" style={{ fontSize: '2rem' }}>
          Que tipo de conta você gostaria de abrir hoje?
        </h2>
        <p className="text-center mb-5" style={{ fontSize: '1.2rem', color: '#666' }}>
          Você também pode adicionar outra conta depois.
        </p>
        <Row className="justify-content-center p-5">
          {accountTypes.map((type) => (
            <Col key={type.key} md={4} className="mb-4 d-flex align-items-stretch">
              <Card
                className="w-100 text-center border-0 shadow-sm"
                style={{ background: 'rgba(195, 195, 195, 0.5)', borderRadius: '2rem', minHeight: '350px', cursor: 'pointer' }}
                onClick={() => onSelectType(type.key)}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <Image
                    src={type.img}
                    alt={type.title}
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain', marginBottom: 24 }}
                  />
                  <Card.Title className="fw-bold" style={{ fontSize: '1.5rem' }}>
                    {type.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#222', marginTop: 8 }}>
                    {type.subtitle}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
