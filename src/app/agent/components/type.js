import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const accountTypes = [
  {
    key: 'collective',
    title: 'Collective Account',
    subtitle: 'You can add another profile later',
    img: '/images/Collective.png', // Replace with your actual image path
  },
  {
    key: 'personal',
    title: 'Personal Account',
    subtitle: 'You can add another profile later',
    img: '/images/Personal.png', // Replace with your actual image path
  },
  {
    key: 'business',
    title: 'Business Account',
    subtitle: 'You can add another profile later',
    img: '/images/Business.png', // Replace with your actual image path
  },
];

export default function Type({ onSelectType }) {
  return (
    <Container className="p-lg-5">
      <h2 className="fw-bold text-center mb-2" style={{ fontSize: '2rem' }}>
        What type of account would you like to open today?
      </h2>
      <p className="text-center mb-5" style={{ fontSize: '1.2rem', color: '#666' }}>
        You can also add another account later.
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
  );
}
