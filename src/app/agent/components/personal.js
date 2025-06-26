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
          <Form.Label>Date of birth *</Form.Label>
          <Form.Control className="border-dark-gray" type="date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="fullname">
          <Form.Label>Full name *</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="rg">
          <Form.Label>RG *</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="socialname">
          <Form.Label>Social name</Form.Label>
          <Form.Control className="border-dark-gray" type="text" />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="breed">
              <Form.Label>Breed *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Breed 1</option>
                <option>Breed 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="lgbtq">
              <Form.Label>Are you LGBTQIAPN+? *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="education">
              <Form.Label>Education *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>High School</option>
                <option>Bachelor&apos;s</option>
                <option>Master&apos;s</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="income">
              <Form.Label>Individual income *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Below $20,000</option>
                <option>$20,000 - $50,000</option>
                <option>Above $50,000</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="mainActivity">
              <Form.Label>Main area of activity *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Activity 1</option>
                <option>Activity 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="otherActivity">
              <Form.Label>Other areas of activity</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Activity 1</option>
                <option>Activity 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="traditionalCommunities">
              <Form.Label>Traditional communities *</Form.Label>
              <Form.Select className="border-dark-gray">
                <option>Select</option>
                <option>Community 1</option>
                <option>Community 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="pcd">
              <Form.Label>Do you have a PCD disability? *</Form.Label>
              <Form.Select
                className="border-dark-gray"
                value={pcd}
                onChange={e => setPcd(e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {pcd === 'Yes' && (
            <Col md={6}>
              <Form.Group className="mb-3" controlId="withoutPcd">
                <Form.Label>In case without PCD which one?</Form.Label>
                <Form.Control className="border-dark-gray" type="text" />
              </Form.Group>
            </Col>
          )}
        </Row>
        <Form.Group className="mb-3" controlId="socialProgramBeneficiary">
          <Form.Label>Beneficiary of any social program?</Form.Label>
          <Form.Select className="border-dark-gray">
            <option>Select</option>
            <option>Yes</option>
            <option>No</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="socialProgramName">
          <Form.Label>Name of the social program</Form.Label>
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
              <Form.Label>Email to login *</Form.Label>
              <Form.Control className="border-dark-gray" type="email" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password *</Form.Label>
              <Form.Control className="border-dark-gray" type="password" />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-4" controlId="acceptTerms">
          <Form.Check
            type="checkbox"
            label="I accept the terms of use and privacy policy:"
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
          Create account
        </Button>
      </Form>
    </Container>
  );
}
