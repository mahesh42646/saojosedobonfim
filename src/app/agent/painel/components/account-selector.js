import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaChevronRight } from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

const TYPE_DISPLAY = {
  personal: {
    name: (profile) => profile.fullname || 'Conta Pessoal',
    description: 'Sua conta pessoal',
    initials: (profile) => profile.fullname ? profile.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P',
  },
  business: {
    name: (profile) => profile.businessData?.razaoSocial || 'Conta Empresarial',
    description: 'Sua conta de pessoa jurídica',
    initials: (profile) => {
      const name = profile.businessData?.razaoSocial || 'B';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
  },
  collective: {
    name: (profile) => profile.collectiveData?.collectiveName || 'Conta Coletiva',
    description: 'Sua conta coletiva',
    initials: (profile) => {
      const name = profile.collectiveData?.collectiveName || 'C';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
  },
};

function AccountSelector({ onAccountSelect }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const userData = localStorage.getItem('agentUser');
        const token = localStorage.getItem('agentToken');
        if (!userData || !token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const user = JSON.parse(userData);
        const cpf = user.cpf;
        const response = await fetch(`${API_BASE_URL}/agent/profile/${cpf}`, {
        // const response = await fetch(`https://mapacultural.saojosedobonfim.pb.gov.br/api/agent/profile/${cpf}`, {
          method: 'GET',  
          headers: {
            'Authorization': token
          }
        });
        if (!response.ok) {
          setError('Failed to fetch profile');
          setLoading(false);
          return;
        }
        const profileData = await response.json();
        setProfile(profileData);
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAccountClick = (type, isComplete) => {
    if (isComplete) {
      onAccountSelect(type);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" size="sm" /> Carregando...</div>;
  if (error) return <div className="text-danger text-center py-5">{error === 'Not authenticated' ? 'Não autenticado' : 
                                                                error === 'Failed to fetch profile' ? 'Falha ao carregar perfil' : 
                                                                'Erro ao carregar perfil'}</div>;
  if (!profile || !profile.typeStatus) return null;

  return (
    <Container style={{ maxWidth: 700, margin: '0 auto', paddingTop: 40 }}>
      <h1 className="fw-bold text-center mb-4" style={{ fontSize: '2.2rem' }}>
        Which account would you like to use?
      </h1>
      <div className="d-flex flex-column align-items-center mb-4">
        
        <div className="fw-semibold" style={{ fontSize: 18, color: '#444' }}>Your accounts</div>
      </div>
      <hr />
      <div>
        {Object.keys(TYPE_DISPLAY).map((type) => {
          const display = TYPE_DISPLAY[type];
          const isComplete = profile.typeStatus[type]?.isComplete;
          return (
            <Row
              key={type}
              className="align-items-center py-3 px-2 mb-2"
              onClick={() => handleAccountClick(type, isComplete)}
              style={{
                borderRadius: 16,
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                cursor: isComplete ? 'pointer' : 'not-allowed',
                transition: 'box-shadow 0.2s',
                border: '1px solid #f2f2f2',
                minHeight: 70,
                opacity: isComplete ? 1 : 0.7
              }}
            >
              <Col xs="auto" className="d-flex align-items-center justify-content-center">
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#fff',
                }}>
                  {display.initials(profile)}
                </div>
              </Col>
              <Col>
                <div className="fw-bold" style={{ fontSize: 20 }}>
                  {display.name(profile)}
                </div>
                <div style={{ color: isComplete ? '#444' : '#bbb', fontSize: 16 }}>
                  {isComplete ? display.description : 'Incompleto'}
                </div>
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                <FaChevronRight color="#222" size={20} />
              </Col>
            </Row>
          );
        })}
      </div>
    </Container>
  );
}

export default AccountSelector;
