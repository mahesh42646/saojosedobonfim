import React, { useState } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';



export default function Personal({ cpf }) {
  const [accepted, setAccepted] = useState(false);
  const [pcd, setPcd] = useState('No');

  return (
    <Container className="py-5 px-2 px-lg-5" style={{ maxWidth: 800 }}>
      <h3 className="fw-bold text-center py-4" style={{ fontSize: '20px' }}>
      Provide more information about yourself (PESSOA FÍSICA)
      </h3>
      <hr />
      <Form>
        <Form.Group className="mb-3" controlId="cpf">
          <Form.Label>CPF *</Form.Label>
          <Form.Control className="border-dark-gray" type="text" value={cpf} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="dob">
          <Form.Label>Data de nascimento *</Form.Label>
          <Form.Control className="border-dark-gray" type="date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="fullname">
          <Form.Label>Nome completo *</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="rg">
          <Form.Label>RG *</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="socialname">
          <Form.Label>Nome social</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gênero *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="breed">
              <Form.Label>Raça *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Raça 1</option>
                <option>Raça 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="lgbtq">
              <Form.Label>Você é LGBTQIAPN+? *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Sim</option>
                <option>Não</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="education">
              <Form.Label>Escolaridade *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Ensino Médio</option>
                <option>Graduação</option>
                <option>Mestrado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="income">
              <Form.Label>Renda individual *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Abaixo de $20,000</option>
                <option>$20,000 - $50,000</option>
                <option>Acima de $50,000</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="mainActivity">
              <Form.Label>Área principal de atividade *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Atividade 1</option>
                <option>Atividade 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="otherActivity">
              <Form.Label>Outras áreas de atividade</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Atividade 1</option>
                <option>Atividade 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="traditionalCommunities">
              <Form.Label>Comunidades tradicionais *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Selecione</option>
                <option>Comunidade 1</option>
                <option>Comunidade 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="pcd">
              <Form.Label>Você tem uma deficiência PCD? *</Form.Label>
              <Form.Select
                className="border-dark-gray"
                value={pcd}
                onChange={e => setPcd(e.target.value)}
              >
                <option>Não</option>
                <option>Sim</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {pcd === 'Yes' && (
            <Col md={6}>
              <Form.Group className="mb-3" controlId="withoutPcd">
                <Form.Label>Caso sem PCD, qual?</Form.Label>
                <Form.Control className="border-dark-gray" type="text" />
              </Form.Group>
            </Col>
          )}
        </Row>
        <Form.Group className="mb-3" controlId="socialProgramBeneficiary">
          <Form.Label>Beneficiário de algum programa social?</Form.Label>
          <Form.Select className="border-dark-gray">
            <option>Selecione</option>
            <option>Sim</option>
            <option>Não</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="socialProgramName">
          <Form.Label>Nome do programa social</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>City 1</option>
                <option>City 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="district">
              <Form.Label>District</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>District 1</option>
                <option>District 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="street">
          <Form.Label>Street</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="telephone">
              <Form.Label>Telephone *</Form.Label>
              <Form.Control className="border-dark-gray" type="text" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="responsible">
              <Form.Label>Responsible for registration *</Form.Label>
              <Form.Control className="border-dark-gray" type="text" />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email para login *</Form.Label>
              <Form.Control className="border-dark-gray" type="email" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Senha *</Form.Label>
              <Form.Control className="border-dark-gray" type="password" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-4" controlId="acceptTerms">
          <Form.Check
            type="checkbox"
            label="Aceito os termos de uso e política de privacidade:"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            required
          />
        </Form.Group>
        <Button
          type="submit"
          className="w-100 fw-bold"
          style={{
            background: '#A8EB7D',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            padding: '18px 0',
            color: '#222',
          }}
        >
          Criar conta
        </Button>
      </Form>
    </Container>
  );
}
