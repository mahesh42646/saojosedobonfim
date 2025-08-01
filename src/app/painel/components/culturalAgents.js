"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { buildApiUrl, buildStaticUrl } from '../../config/api';
import { useAuth } from '../authContex';
import jsPDF from 'jspdf';

function AgentDetails({ agent, onBack, user }) {
  const [tab, setTab] = React.useState("individual");
  const [statusLoading, setStatusLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [currentAgent, setCurrentAgent] = React.useState(agent);
  const { token } = useAuth();
  
  // Handle status update (activate/deactivate)
  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusLoading(true);
      
      const response = await fetch(buildApiUrl(`/agent/profile/${currentAgent.cpf}/status`), {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar status do agente');
      }

      const data = await response.json();
      
      // Update local agent data
      setCurrentAgent(prev => ({
        ...prev,
        status: newStatus
      }));

      // Show success message (you can replace this with a toast notification)
      alert(data.message);
      
    } catch (error) {
      console.error('Erro ao atualizar status do agente:', error);
      alert(`Erro: ${error.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle agent deletion with confirmation
  const handleDeleteAgent = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Tem certeza que deseja excluir o agente "${agent.fullname || 'Agente Sem Nome'}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (!isConfirmed) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      
      const response = await fetch(buildApiUrl(`/agent/profile/${currentAgent.cpf}`), {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao excluir agente');
      }

      const data = await response.json();
      
      // Show success message
      alert(data.message || 'Agente excluído com sucesso!');
      
      // Go back to the agents list
      onBack();
      
    } catch (error) {
      console.error('Erro ao excluir agente:', error);
      alert(`Erro ao excluir agente: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date from ISO string to YYYY-MM-DD format for HTML date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Extract year, month, day and format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format date for display in PDF
  const formatDateForPDF = (dateString) => {
    if (!dateString) return 'Não fornecido';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 6;
    const sectionSpacing = 10;
    
    // Header with admin info and date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado por: ${user?.name || 'Administrador'} • Data: ${new Date().toLocaleDateString('pt-BR')}`, 15, 10);
    
    // Main title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Detalhes do Agente Cultural', 15, yPosition);
    yPosition += 15;
    
    // Agent name and type
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(agent.fullname || 'Agente Sem Nome', 15, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Tipo de Agente: ${getAgentType(agent)}`, 15, yPosition);
    yPosition += sectionSpacing;
    
    // Helper function to add a section
    const addSection = (title, fields) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(title, 15, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      
      fields.forEach(field => {
        if (field.value) {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          const maxWidth = 180;
          const lines = doc.splitTextToSize(`${field.label}: ${field.value}`, maxWidth);
          
          lines.forEach(line => {
            doc.text(line, 20, yPosition);
            yPosition += lineHeight;
          });
        }
      });
      
      yPosition += sectionSpacing;
    };
    
    // Common Personal Data
    addSection('Informações Pessoais', [
      { label: 'CPF', value: agent.cpf },
      { label: 'Nome Completo', value: agent.fullname },
      { label: 'Nome Social', value: agent.socialname },
      { label: 'Gênero', value: agent.gender },
      { label: 'Raça', value: agent.breed },
      { label: 'LGBTQIAPN+', value: agent.lgbtq },
      { label: 'Data de Nascimento', value: formatDateForPDF(agent.dob) },
      { label: 'RG', value: agent.rg }
    ]);
    
    // Accessibility Information
    addSection('Informações de Acessibilidade', [
      { label: 'Possui Deficiência PCD', value: agent.pcd },
      { label: 'Detalhes PCD', value: agent.pcd !== 'Não' ? agent.withoutPcd : null }
    ]);
    
    // Socioeconomic and Educational Information
    addSection('Informações Socioeconômicas e Educacionais', [
      { label: 'Educação', value: agent.education },
      { label: 'Renda Individual', value: agent.income },
      { label: 'Beneficiário de Programa Social', value: agent.socialProgramBeneficiary },
      { label: 'Nome do Programa Social', value: agent.socialProgramName }
    ]);
    
    // Professional Information
    addSection('Informações Profissionais', [
      { label: 'Área Principal de Atividade', value: agent.mainActivity },
      { label: 'Comunidades Tradicionais', value: agent.traditionalCommunities },
      { label: 'Outra Atividade', value: agent.otherActivity }
    ]);
    
    // Address
    addSection('Endereço', [
      { label: 'Cidade', value: agent.city },
      { label: 'Bairro', value: agent.district },
      { label: 'Rua e Número', value: agent.street }
    ]);
    
    // Contact
    addSection('Contato', [
      { label: 'Telefone', value: agent.telephone },
      { label: 'Email', value: agent.email }
    ]);
    
    // Responsible for Registration
    if (agent.responsible) {
      addSection('Responsável pela Inscrição', [
        { label: 'Pessoa Responsável', value: agent.responsible }
      ]);
    }
    
    // Type-specific data
    if (agent.typeStatus?.business?.isComplete && agent.businessData) {
      addSection('Informações da Empresa', [
        { label: 'Tipo de CNPJ', value: agent.businessData.cnpjType },
        { label: 'Razão Social', value: agent.businessData.razaoSocial },
        { label: 'Nome Fantasia', value: agent.businessData.nomeFantasia },
        { label: 'Número do CNPJ', value: agent.businessData.cnpj }
      ]);
    }
    
    if (agent.typeStatus?.collective?.isComplete && agent.collectiveData) {
      addSection('Informações do Coletivo', [
        { label: 'Nome do Coletivo', value: agent.collectiveData.collectiveName },
        { label: 'Data de Criação', value: `${agent.collectiveData.dayCreated}/${agent.collectiveData.monthCreated}/${agent.collectiveData.yearCreated}` },
        { label: 'Participantes', value: agent.collectiveData.participants }
      ]);
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, 190, 285, { align: 'right' });
    }
    
    // Download the PDF
    const fileName = `${agent.fullname || 'Agente'}_Detalhes.pdf`;
    doc.save(fileName);
  };
  
  // Get agent type status
  const getAgentType = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'Pessoal';
    if (agent.typeStatus?.business?.isComplete) return 'Empresarial';
    if (agent.typeStatus?.collective?.isComplete) return 'Coletivo';
    return 'Incompleto';
  };

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Get active agent type key for profile photo
  const getActiveAgentTypeKey = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'personal';
    if (agent.typeStatus?.business?.isComplete) return 'business';
    if (agent.typeStatus?.collective?.isComplete) return 'collective';
    return 'personal'; // default fallback
  };

  // Get agent profile photo URL
  const getAgentProfilePhoto = (agent) => {
    const activeType = getActiveAgentTypeKey(agent);
    const photoFilename = agent.profilePhotos?.[activeType];
    return photoFilename ? buildStaticUrl(`/uploads/${photoFilename}`) : null;
  };

  // Check which tabs should be available based on completed types
  const getAvailableTabs = () => {
    const tabs = [];
    if (agent.typeStatus?.personal?.isComplete) {
      tabs.push({ key: 'individual', label: 'Individual' });
    }
    if (agent.typeStatus?.business?.isComplete) {
      tabs.push({ key: 'legal', label: 'Pessoa Jurídica' });
    }
    if (agent.typeStatus?.collective?.isComplete) {
      tabs.push({ key: 'collective', label: 'Grupo Coletivo' });
    }
    
    // If no types are complete, show individual as default
    if (tabs.length === 0) {
      tabs.push({ key: 'individual', label: 'Individual' });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Set default tab to first available tab
  React.  useEffect(() => {
    if (availableTabs.length > 0) {
      setTab(availableTabs[0].key);
    }
  }, [availableTabs]);

  const renderIndividualContent = () => (
    <>
      {/* Dados Pessoais */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Dados Pessoais</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">CPF *</label>
            <input placeholder="" className="form-control p-2" value={agent.cpf || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome completo *</label>
            <input placeholder="" className="form-control p-2" value={agent.fullname || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome social</label>
            <input placeholder="" className="form-control p-2" value={agent.socialname || ''} readOnly />
          </div>
          <div className="d-lg-flex gap-4">
            <div className="d-flex flex-column gap-2 w-50">
              <label className="form-lable">Gênero *</label>
              <input placeholder="" className="form-control p-2" value={agent.gender || ''} readOnly />
            </div>
            <div className="d-flex flex-column gap-2 w-50">
              <label className="form-lable">Raça *</label>
              <input placeholder="" className="form-control p-2" value={agent.breed || ''} readOnly />
            </div>
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Você é LGBTQIAPN+? *</label>
            <input placeholder="" className="form-control p-2" value={agent.lgbtq || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Data de nascimento *</label>
            <input type="date" className="form-control p-2" value={formatDateForInput(agent.dob)} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">RG *</label>
            <input placeholder="" className="form-control p-2" value={agent.rg || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Informações de Acessibilidade */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Informações de Acessibilidade</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Você possui deficiência PCD? *</label>
            <input placeholder="" className="form-control p-2" value={agent.pcd || ''} readOnly />
          </div>
          {agent.pcd !== 'Não' && (
            <div className="d-flex flex-column w-100 gap-2">
              <label className="form-lable">Em caso de não ter PCD, qual?</label>
              <input placeholder="" className="form-control p-2" value={agent.withoutPcd || ''} readOnly />
            </div>
          )}
        </div>
      </div>

      {/* Informações Socioeconômicas e Educacionais */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Informações Socioeconômicas e Educacionais</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column gap-2">
            <label className="form-lable">Educação *</label>
            <input placeholder="" className="form-control p-2" value={agent.education || ''} readOnly />
          </div>
          <div className="d-flex flex-column gap-2">
            <label className="form-lable">Renda individual *</label>
            <input placeholder="" className="form-control p-2" value={agent.income || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Beneficiário de algum programa social?</label>
            <input placeholder="" className="form-control p-2" value={agent.socialProgramBeneficiary || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome do programa social</label>
            <input placeholder="" className="form-control p-2" value={agent.socialProgramName || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Informações Profissionais */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Informações Profissionais</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Área principal de atividade *</label>
            <input placeholder="" className="form-control p-2" value={agent.mainActivity || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Você pertence a comunidades tradicionais?</label>
            <input placeholder="" className="form-control p-2" value={agent.traditionalCommunities || ''} readOnly />
            <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>(Ex.: quilombolas, indígenas, comunidades ribeirinhas, etc.)</span>
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Outra atividade</label>
            <input placeholder="" className="form-control p-2" value={agent.otherActivity || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Endereço</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Cidade</label>
            <input placeholder="" className="form-control p-2" value={agent.city || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Bairro</label>
            <input placeholder="" className="form-control p-2" value={agent.district || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome da rua e número</label>
            <input placeholder="" className="form-control p-2" value={agent.street || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Contato</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Telefone</label>
            <input placeholder="" className="form-control p-2" value={agent.telephone || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">E-mail</label>
            <input placeholder="" className="form-control p-2" value={agent.email || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Responsável pela Inscrição */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Responsável pela Inscrição</div>
        <div className="d-flex flex-column gap-2">
          <label className="form-lable">Nome da pessoa responsável pela inscrição (se não for a própria pessoa)</label>
          <input placeholder="" className="form-control p-2" value={agent.responsible || ''} readOnly />
        </div>
      </div>
    </>
  );

  const renderLegalEntityContent = () => (
    <>
      {/* Business Data Only - Type Specific */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Insira os dados adicionais da organização</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Tipo de CNPJ</label>
            <input placeholder="Selecione" className="form-control p-2" value={agent.businessData?.cnpjType || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Razão Social</label>
            <small className="text-muted">O nome deve corresponder ao registrado oficialmente.</small>
            <input placeholder="" className="form-control p-2" value={agent.businessData?.razaoSocial || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome fantasia da empresa (Opcional)</label>
            <input placeholder="" className="form-control p-2" value={agent.businessData?.nomeFantasia || ''} readOnly />
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Número do CNPJ</label>
            <input placeholder="" className="form-control p-2" value={agent.businessData?.cnpj || ''} readOnly />
          </div>
        </div>
      </div>
    </>
  );

  const renderCollectiveContent = () => (
    <>
      {/* Collective Data Only - Type Specific */}
      <div>
        <div className="fw-bold h5 pt-3 pb-2">Insira os dados adicionais do grupo</div>
        <div className="d-grid w-100 gap-3">
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Nome do Coletivo *</label>
            <input placeholder="" className="form-control p-2" value={agent.collectiveData?.collectiveName || ''} readOnly />
          </div>
          <div>
            <label className="form-lable">Data de criação *</label>
            <div className="d-lg-flex gap-4 mt-2">
              <div className="d-flex flex-column gap-2 flex-fill">
                <label className="form-lable small">Dia</label>
                <input placeholder="16" className="form-control p-2" value={agent.collectiveData?.dayCreated || ''} readOnly />
              </div>
              <div className="d-flex flex-column gap-2 flex-fill">
                <label className="form-lable small">Mês</label>
                <input placeholder="Julho" className="form-control p-2" value={agent.collectiveData?.monthCreated || ''} readOnly />
              </div>
              <div className="d-flex flex-column gap-2 flex-fill">
                <label className="form-lable small">Ano</label>
                <input placeholder="1998" className="form-control p-2" value={agent.collectiveData?.yearCreated || ''} readOnly />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column w-100 gap-2">
            <label className="form-lable">Quantas pessoas participam do coletivo? *</label>
            <textarea placeholder="" className="form-control p-2" rows="3" value={agent.collectiveData?.participants || ''} readOnly />
          </div>
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (tab) {
      case 'individual':
        return renderIndividualContent();
      case 'legal':
        return renderLegalEntityContent();
      case 'collective':
        return renderCollectiveContent();
      default:
        return renderIndividualContent();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex fw-bold">
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}> Detalhes do Agente Cultural</h2>
        </div>

        <div className="d-flex gap-3">
          <button 
            className="rounded-5 text-white" 
            onClick={handleDeleteAgent}
            disabled={deleteLoading}
            style={{ 
              background:  'rgb(238, 4, 0)', 
              color: '#222', 
              border: '1px solid rgb(143, 0, 0)', 
              borderRadius: 16, 
              padding: '6px 26px', 
              fontWeight: 500, 
              fontSize: 15, 
              cursor: deleteLoading ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6 
            }}
          >
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        {/* </div>
        <div className="d-flex me-2 gap-2"> */}
          {(currentAgent.status || 'active') === 'active' ? (
            <button 
              className="rounded-5" 
              onClick={() => handleStatusUpdate('inactive')}
              disabled={statusLoading}
              style={{ 
                background: statusLoading ? '#ccc' : 'rgba(249, 217, 217, 0.64)', 
                color: 'black', 
                border: 'none', 
                borderRadius: 16, 
                padding: '6px 36px', 
                fontWeight: 600, 
                fontSize: 16, 
                cursor: statusLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {statusLoading ? 'Processando...' : 'Desativar'}
            </button>
          ) : (
            <button 
              className="rounded-5" 
              onClick={() => handleStatusUpdate('active')}
              disabled={statusLoading}
              style={{ 
                background: statusLoading ? '#ccc' : '#7CFC00', 
                color: '#222', 
                border: 'none', 
                borderRadius: 16, 
                padding: '6px 36px', 
                fontWeight: 600, 
                fontSize: 16, 
                cursor: statusLoading ? 'not-allowed' : 'pointer' 
              }}
            >
              {statusLoading ? 'Processando...' : 'Ativar'}
            </button>
          )}
        </div>
      </div>
      <div className="border my-lg-3 my-1 rounded-4">
        {/* Header */}
        <div style={{ background: '#f7f7f7', borderBottom: '1px solid #eee', padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {getAgentProfilePhoto(agent) ? (
                <Image 
                  src={getAgentProfilePhoto(agent)} 
                  alt={agent.fullname || 'Agente'} 
                  width={56}
                  height={56}
                  style={{ borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: getAgentColor(agent), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }}>
                  {(agent.fullname || 'A').split(' ').length > 1 ? (agent.fullname || 'A').split(' ').map(n => n[0]).join('') : (agent.fullname || 'A')[0]}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>{agent.fullname || 'Agente Sem Nome'}</div>
                <div style={{ color: '#222', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: (currentAgent.status || 'active') === 'active' ? '#2ecc40' : '#ff6b6b', fontSize: 18 }}>●</span> 
                  {currentAgent.typeStatus?.personal?.isComplete ? 'Conta Pessoal' : currentAgent.typeStatus?.business?.isComplete ? 'Conta Empresarial' : currentAgent.typeStatus?.collective?.isComplete ? 'Conta Coletiva' : 'Incompleto'}
                  <span style={{ 
                    background: (currentAgent.status || 'active') === 'active' ? '#e8f5e8' : '#ffe8e8', 
                    color: (currentAgent.status || 'active') === 'active' ? '#2ecc40' : '#ff6b6b', 
                    padding: '2px 8px', 
                    borderRadius: 12, 
                    fontSize: 12, 
                    fontWeight: 600,
                    marginLeft: 8
                  }}>
                    {(currentAgent.status || 'active') === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                className="rounded-5" 
                onClick={generatePDF}
                style={{ background: '#F5FFF0', color: '#222', border: '1px solid rgb(216, 251, 216)', borderRadius: 16, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Baixar Detalhes do Agente <span style={{ fontSize: 18 }}><i className="bi bi-download"></i></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="d-flex gap-3 py-1 px-lg-3 border-bottom">
          {availableTabs.map((tabItem) => (
            <div 
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)} 
              className="btn border-0 py-2 d-flex align-items-center" 
              style={{   
                fontWeight: tab === tabItem.key ? 600 : 500,
                color: tab === tabItem.key ? '#000' : '#666'
              }}
            >
              {tabItem.label}
            </div>
          ))}
        </div>
        
        {/* Form */}
        <form className="d-flex flex-column px-5 py-4">
          {renderTabContent()}
        </form>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const { token, isAuthenticated, user } = useAuth();

  // Fetch agents from API
  const fetchAgents = useCallback(async (search = '', type = 'all', status = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated() || !token) {
        setError('Autenticação necessária. Por favor, faça login.');
        setAgents([]);
        setFilteredAgents([]);
        return;
      }
      
      let url = buildApiUrl('/agent/profiles');
      const params = [];
      
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      
      if (type !== 'all') {
        params.push(`type=${encodeURIComponent(type)}`);
      }
      
      if (status !== 'all') {
        params.push(`status=${encodeURIComponent(status)}`);
      }
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        throw new Error('Falha ao buscar agentes');
      }

      const data = await response.json();
      console.log('Resposta da API:', data); // Debug log
      
      // Handle the response structure from backend
      let agentsArray = [];
      if (data && typeof data === 'object') {
        if (Array.isArray(data.profiles)) {
          // Backend returns { profiles: [...], stats: {...} }
          agentsArray = data.profiles;
        } else if (Array.isArray(data)) {
          // Backend returns direct array
          agentsArray = data;
        }
      }
      
      console.log('Array de agentes processado:', agentsArray); // Debug log
      setAgents(agentsArray);
      setFilteredAgents(agentsArray);
    } catch (err) {
      console.error('Erro ao buscar agentes:', err);
      setError(err.message);
      // Reset to empty arrays on error
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAgents(searchTerm, selectedType, selectedStatus);
  };

  // Filter agents locally for instant search
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredAgents(agents);
    } else {
      // Ensure agents is an array before filtering
      const agentsArray = Array.isArray(agents) ? agents : [];
      const filtered = agentsArray.filter(agent => 
        agent.fullname?.toLowerCase().includes(term.toLowerCase()) ||
        agent.email?.toLowerCase().includes(term.toLowerCase()) ||
        agent.cpf?.includes(term)
      );
      setFilteredAgents(filtered);
    }
  };

  // Handle type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setShowFilter(false);
    fetchAgents(searchTerm, type, selectedStatus);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setShowStatusFilter(false);
    fetchAgents(searchTerm, selectedType, status);
  };

  // Get agent type status
  const getAgentType = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'Pessoal';
    if (agent.typeStatus?.business?.isComplete) return 'Empresarial';
    if (agent.typeStatus?.collective?.isComplete) return 'Coletivo';
    return 'Incompleto';
  };

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Get active agent type key for profile photo
  const getActiveAgentTypeKey = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'personal';
    if (agent.typeStatus?.business?.isComplete) return 'business';
    if (agent.typeStatus?.collective?.isComplete) return 'collective';
    return 'personal'; // default fallback
  };

  // Get agent profile photo URL
  const getAgentProfilePhoto = (agent) => {
    const activeType = getActiveAgentTypeKey(agent);
    const photoFilename = agent.profilePhotos?.[activeType];
    return photoFilename ? buildStaticUrl(`/uploads/${photoFilename}`) : null;
  };

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents(searchTerm, selectedType, selectedStatus);
  }, [fetchAgents, searchTerm, selectedType, selectedStatus]);

  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-3" >
      {selectedAgent ? (
        <AgentDetails agent={selectedAgent} onBack={() => setSelectedAgent(null)} user={user} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>Lista de Agentes Culturais</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Buscar agente"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 400 }}
                />
                                  <div className="position-relative">
                    {/* <button 
                      type="button"
                      className="btn rounded-5 px-4 py-2"
                      style={{ background: '#F5FFF0', border: '1px solid rgb(216, 251, 216)' }}
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      {selectedType === 'all' ? 'Todos os Tipos' : selectedType === 'personal' ? 'Pessoal' : selectedType === 'business' ? 'Empresarial' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} 
                      <i className="bi bi-chevron-down ms-2"></i>
                    </button> */}
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
                          onClick={() => handleTypeChange('all')}
                          style={{ cursor: 'pointer' }}
                        >
                          Todos os Tipos
                        </div>
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleTypeChange('personal')}
                          style={{ cursor: 'pointer' }}
                        >
                          Pessoal
                        </div>
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleTypeChange('business')}
                          style={{ cursor: 'pointer' }}
                        >
                          Empresarial
                        </div>
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleTypeChange('collective')}
                          style={{ cursor: 'pointer' }}
                        >
                          Coletivo
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="position-relative">
                    <button 
                      type="button"
                      className="btn rounded-5 px-4 py-2 ms-2"
                      style={{ background: '#F0F8FF', border: '1px solid rgb(173, 216, 230)' }}
                      onClick={() => setShowStatusFilter(!showStatusFilter)}
                    >
                      {selectedStatus === 'all' ? 'Todos os Status' : selectedStatus === 'active' ? 'Ativos' : 'Inativos'} 
                      <i className="bi bi-chevron-down ms-2"></i>
                    </button>
                    {showStatusFilter && (
                      <div 
                        className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-sm"
                        style={{ 
                          zIndex: 1000,
                          minWidth: '180px',
                          border: '1px solid #eee'
                        }}
                      >
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleStatusChange('all')}
                          style={{ cursor: 'pointer' }}
                        >
                          Todos os Status
                        </div>
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleStatusChange('active')}
                          style={{ cursor: 'pointer' }}
                        >
                          Ativos
                        </div>
                        <div 
                          className="px-3 py-2 cursor-pointer hover-bg-light"
                          onClick={() => handleStatusChange('inactive')}
                          style={{ cursor: 'pointer' }}
                        >
                          Inativos
                        </div>
                      </div>
                    )}
                  </div>
              </form>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Carregando agentes...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
              {error}
              <br />
              <button 
                onClick={() => fetchAgents(searchTerm, selectedType, selectedStatus)} 
                style={{ 
                  background: '#7CFC00', 
                  border: 'none', 
                  borderRadius: 16, 
                  padding: '8px 16px', 
                  fontWeight: 600, 
                  color: '#fff', 
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'Nenhum agente encontrado para sua busca.' : 'Nenhum agente encontrado.'}
            </div>
          ) : (
            <div className="d-flex flex-column gap-2" >
              {Array.isArray(filteredAgents) && filteredAgents.map((agent, idx) => (
                <div
                  key={agent._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: 'transparent',
                    borderRadius: 20,
                    minHeight: 48,
                    cursor: 'pointer',
                    padding: '8px 0',
                    // borderBottom: '1px solid #eee'
                  }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  {getAgentProfilePhoto(agent) ? (
                    <Image 
                      src={getAgentProfilePhoto(agent)} 
                      alt={agent.fullname || 'Agente'} 
                      width={36}
                      height={36}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      background: getAgentColor(agent), 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#fff', 
                      fontWeight: 700, 
                      fontSize: 18 
                    }}>
                      {(agent.fullname || 'A').split(' ').length > 1 
                        ? (agent.fullname || 'A').split(' ').map(n => n[0]).join('') 
                        : (agent.fullname || 'A')[0]}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 16 }}>
                      {agent.fullname || 'Agente Sem Nome'}
                    </div>
                    <div style={{ color: '#888', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      Tipo: {getAgentType(agent)}
                      <span style={{ 
                        background: (agent.status || 'active') === 'active' ? '#e8f5e8' : '#ffe8e8', 
                        color: (agent.status || 'active') === 'active' ? '#2ecc40' : '#ff6b6b', 
                        padding: '1px 6px', 
                        borderRadius: 8, 
                        fontSize: 11, 
                        fontWeight: 600
                      }}>
                        {(agent.status || 'active') === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  {/* <div style={{ color: '#666', fontSize: 12 }}>
                    {agent.cpf || 'No CPF'}
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
