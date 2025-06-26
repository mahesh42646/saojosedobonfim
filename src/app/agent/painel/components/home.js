"use client"
import React from 'react';
import { useAccountType } from '../accountTypeContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

const ProjectCard = ({ title, imageSrc, onClose }) => (
  <div className=" rounded-4 p-4 h-100 position-relative" style={{ background: '#FFEB69' }}>
    <button  onClick={onClose}  className="btn position-absolute top-0 end-0 mt-2 me-2 rounded-circle bg-light"  >
      ✕
    </button>
    <h3 className="fs-5 pb-2">{title}</h3>
    <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
      <Image
        src={imageSrc}
        alt={title}
        width={150}
        height={150}
        className="object-fit-contain"
      />
    </div>
  </div>
);

const NewProjectCard = () => (
  <div className="border border-2 border-dashed rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-center">
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

      {/* Projects Section */}
      <div className="my-4 d-flex justify-content-between align-items-center">
        <h3 className="fw-semibold">Últimos Projetos e Espaços</h3>
        <Link href="/projects" className="text-dark text-decoration-underline">
          Ver todas
        </Link>
      </div>

      <Row className="g-3">
        <Col md={3}>
          <ProjectCard
            title="Agendar a sua transferência"
            imageSrc="/images/card.png"
            onClose={() => console.log('Close calendar')}
          />
        </Col>
        <Col md={3}>
          <ProjectCard
            title="Autorize débitos automáticos"
            imageSrc="/images/card.png"
            onClose={() => console.log('Close debits')}
          />
        </Col>
        <Col md={3}>
          <ProjectCard
            title="Conversão automática"
            imageSrc="/images/card.png"
            onClose={() => console.log('Close conversion')}
          />
        </Col>
        <Col md={3}>
          <NewProjectCard />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
