'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Type from './components/type';
import CPF from './components/cpf';
import Business from './components/business';
import Personal from './components/personal';
import Collective from './components/collective';
import { FaArrowLeft } from 'react-icons/fa';

// Create a client component that uses useSearchParams
function AgentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState('main');
  const [selectedType, setSelectedType] = useState(null);
  const [cpfValue, setCpfValue] = useState('');

  useEffect(() => {
    // Check URL on initial load and after refresh
    const view = searchParams.get('view');
    const type = searchParams.get('type');
    if (view === 'type') {
      setCurrentView('type');
    } else if (view === 'cpf') {
      setCurrentView('cpf');
      if (type) setSelectedType(type);
    } else if (view === 'form') {
      setCurrentView('form');
      if (type) setSelectedType(type);
    }
  }, [searchParams]);

  const handleNewAgent = () => {
    setCurrentView('type');
    // Update URL without navigation
    router.push('/agent?type', { scroll: false });
  };

  const handleMyAccounts = () => {
    router.push('/agent/painel');
  };

  const handleSelectType = (typeKey) => {
    setSelectedType(typeKey);
    setCurrentView('cpf');
    router.push(`/agent?cpf&type=${typeKey}`, { scroll: false });
  };

  const handleBack = () => {
    if (currentView === 'form') {
      setCurrentView('cpf');
      router.push(`/agent?cpf&type=${selectedType}`, { scroll: false });
    } else if (currentView === 'cpf') {
      setCurrentView('type');
      router.push('/agent?type', { scroll: false });
    } else if (currentView === 'type') {
      setCurrentView('main');
      router.push('/agent', { scroll: false });
    }
  };

  const handleCpfContinue = (cpf) => {
    setCpfValue(cpf);
    setCurrentView('form');
    router.push(`/agent?view=form&type=${selectedType}`, { scroll: false });
  };

  // Back arrow component
  const BackArrow = () => (
    <div className="d-flex align-items-center  gap-5 w-100"
      style={{ position: 'absolute', top: 30, left: 30, cursor: 'pointer', zIndex: 10, fontSize: 28, }}
      onClick={handleBack}   >
      <div className="d-flex align-items-center ">
        <Image
          src="/images/MadminLogo.jpg"
          alt="Gestor Cultural"
          width={160}
          height={40}
          className="object-fit-contain"
        />
      </div>
      <div className="d-flex  align-items-center justify-content-between w-75">
        <div> ←</div>
        <div> x</div>
      </div>
    </div>
  );

  // Render Type component if currentView is 'type'
  if (currentView === 'type') {
    return (
      <div style={{ position: 'relative' }}>
        <BackArrow />
        <Type onSelectType={handleSelectType} />
      </div>
    );
  }

  if (currentView === 'cpf') {
    return (
      <div style={{ position: 'relative' }}>
        <BackArrow />
        <CPF selectedType={selectedType} onContinue={handleCpfContinue} />
      </div>
    );
  }

  if (currentView === 'form') {
    let FormComponent = null;
    if (selectedType === 'business') FormComponent = Business;
    if (selectedType === 'personal') FormComponent = Personal;
    if (selectedType === 'collective') FormComponent = Collective;
    return (
      <div style={{ position: 'relative' }}>
        <BackArrow />
        {FormComponent && <FormComponent cpf={cpfValue} />}
      </div>
    );
  }

  // Render main cards view
  return (
    <Type onSelectType={handleSelectType} />
  );
}

// Main page component with Suspense boundary
export default function AgentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentPageContent />
    </Suspense>
  );
}
