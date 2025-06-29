"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { buildApiUrl } from '../../config/api';

function AgentDetails({ agent, onBack }) {
  const [tab, setTab] = React.useState("individual");
  
  // Get agent type status
  const getAgentType = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'Personal';
    if (agent.typeStatus?.business?.isComplete) return 'Business';
    if (agent.typeStatus?.collective?.isComplete) return 'Collective';
    return 'Incomplete';
  };

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div>
      <div className="  d-flex justify-content-between align-items-center">
        <div className="d-flex fw-bold">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
         
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}> Detalhes do Agente Cultural</h2>
          </div>
        <div className="d-flex me-2 gap-2">
          <button className="rounded-5" style={{ background: '#eee', color: '#888', border: 'none', padding: '6px 36px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Disable</button>
          <button className="rounded-5" style={{ background: '#7CFC00', color: '#222', border: 'none', borderRadius: 16, padding: '6px 36px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Active</button>
        </div>
      </div>
      <div className="border my-lg-3 my-1  rounded-4">
        {/* Header */}
        <div style={{ background: '#f7f7f7', borderBottom: '1px solid #eee', padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {agent.avatar ? (
                <Image 
                  src={agent.avatar} 
                  alt={agent.fullname || 'Agent'} 
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
                <div style={{ fontWeight: 600, fontSize: 20 }}>{agent.fullname || 'Unnamed Agent'}</div>
                <div style={{ color: '#222', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#2ecc40', fontSize: 18 }}>●</span> {getAgentType(agent)} Agent
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="rounded-5 " style={{ background: '#F5FFF0', color: '#222', border: '1px solid rgb(216, 251, 216)', borderRadius: 16, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                Download Agent Details <span style={{ fontSize: 18 }}><i className="bi bi-download"></i></span>
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="d-flex gap-3 py-1 px-lg-3 border-bottom">
          <div onClick={() => setTab('individual')} className=" btn border-0 py-2 d-flex align-items-center " style={{   
            fontWeight: tab === 'individual' ? 600 : 500,  }}>
            Individual {tab === 'individual' && <span style={{ fontSize: 18 }}></span>}
          </div>
          <div onClick={() => setTab('legal')} className=" btn border-0 py-2 d-flex align-items-center " style={{   
            fontWeight: tab === 'legal' ? 600 : 500,  }}>
            Legal Entity {tab === 'legal' && <span style={{ fontSize: 18 }}></span>}
          </div>
          <div onClick={() => setTab('collective')} className=" btn border-0 py-2 d-flex align-items-center " style={{   
            fontWeight: tab === 'collective' ? 600 : 500,  }}>
            Collective Group {tab === 'collective' && <span style={{ fontSize: 18 }}></span>}
          </div>
          
          
        </div>
        {/* Form */}
        <form className="d-flex flex-column  px-5 py-4">
          {/* Dados Pessoais */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Dados Pessoais</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >CPF *</label>
                <input placeholder="" className="form-control p-2" value={agent.cpf || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Full name *</label>
                <input placeholder="" className="form-control p-2" value={agent.fullname || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Social name</label>
                <input placeholder="" className="form-control p-2" value={agent.socialname || ''} readOnly />
              </div>
              <div className="d-lg-flex gap-4">
              <div className="d-flex flex-column gap-2 w-50" >
                <label className="form-lable" >Gender *</label>
                <input placeholder="" className="form-control p-2" value={agent.gender || ''} readOnly />
              </div>
              <div className="d-flex flex-column gap-2 w-50" >
                <label className="form-lable" >Breed *</label>
                <input placeholder="" className="form-control p-2" value={agent.breed || ''} readOnly />
              </div>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Are you LGBTQIAPN+? *</label>
                <input placeholder="" className="form-control p-2" value={agent.lgbtq || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Date of birth *</label>
                <input type="date" className="form-control p-2" value={agent.dob || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >RG *</label>
                <input placeholder="" className="form-control p-2" value={agent.rg || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Informações de Acessibilidade */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações de Acessibilidade</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Do you have a PCD disability? *</label>
                <input placeholder="" className="form-control p-2" value={agent.pcd || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >In case without PCD which one?</label>
                <input placeholder="" className="form-control p-2" value={agent.withoutPcd || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Informações Socioeconômicas e Educacionais */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações Socioeconômicas e Educacionais</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column gap-2" >
                <label className="form-lable" >Education *</label>
                <input placeholder="" className="form-control p-2" value={agent.education || ''} readOnly />
              </div>
              <div className="d-flex flex-column gap-2" >
                <label className="form-lable" >Individual income *</label>
                <input placeholder="" className="form-control p-2" value={agent.income || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Beneficiary of any social program?</label>
                <input placeholder="" className="form-control p-2" value={agent.socialProgramBeneficiary || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Name of the social program</label>
                <input placeholder="" className="form-control p-2" value={agent.socialProgramName || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Informações Profissionais */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações Profissionais</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Main area of activity *</label>
                <input placeholder="" className="form-control p-2" value={agent.mainActivity || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Do you belong to traditional communities?</label>
                <input placeholder="" className="form-control p-2" value={agent.traditionalCommunities || ''} readOnly />
                <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>(E.g.: quilombolas, indigenous people, riverside communities, etc.)</span>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Other activity</label>
                <input placeholder="" className="form-control p-2" value={agent.otherActivity || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Endereço */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Endereço</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >City</label>
                <input placeholder="" className="form-control p-2" value={agent.city || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >District</label>
                <input placeholder="" className="form-control p-2" value={agent.district || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Street name and number</label>
                <input placeholder="" className="form-control p-2" value={agent.street || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Contato */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Contato</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Telefone</label>
                <input placeholder="" className="form-control p-2" value={agent.telephone || ''} readOnly />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Email</label>
                <input placeholder="" className="form-control p-2" value={agent.email || ''} readOnly />
              </div>
            </div>
          </div>
          {/* Responsável pela Inscrição */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Responsável pela Inscrição</div>
            <div className="d-flex flex-column gap-2" >
              <label className="form-lable" >Name of person responsible for registration (if not the person themselves)</label>
              <input placeholder="" className="form-control p-2" value={agent.responsible || ''} readOnly />
            </div>
          </div>
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
  const [showFilter, setShowFilter] = useState(false);

  // Fetch agents from API
  const fetchAgents = useCallback(async (search = '', type = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = buildApiUrl('/agent/profiles');
      const params = [];
      
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }
      
      if (type !== 'all') {
        params.push(`type=${encodeURIComponent(type)}`);
      }
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data);
      setFilteredAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);  // Empty dependency array since it doesn't depend on any state/props

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAgents(searchTerm, selectedType);
  };

  // Filter agents locally for instant search
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => 
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
    fetchAgents(searchTerm, type);
  };

  // Get agent type status
  const getAgentType = (agent) => {
    if (agent.typeStatus?.personal?.isComplete) return 'Personal';
    if (agent.typeStatus?.business?.isComplete) return 'Business';
    if (agent.typeStatus?.collective?.isComplete) return 'Collective';
    return 'Incomplete';
  };

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents(searchTerm, selectedType);
  }, [fetchAgents, searchTerm, selectedType]);

  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-3" >
      {selectedAgent ? (
        <AgentDetails agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>List of Cultural Agents</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Search agent"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 400 }}
                />
                <div className="position-relative">
                  <button 
                    type="button"
                    className="btn rounded-5 px-4 py-2"
                    style={{ background: '#F5FFF0', border: '1px solid rgb(216, 251, 216)' }}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    {selectedType === 'all' ? 'All Types' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} 
                    <i className="bi bi-chevron-down ms-2"></i>
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
                        onClick={() => handleTypeChange('all')}
                        style={{ cursor: 'pointer' }}
                      >
                        All Types
                      </div>
                      <div 
                        className="px-3 py-2 cursor-pointer hover-bg-light"
                        onClick={() => handleTypeChange('personal')}
                        style={{ cursor: 'pointer' }}
                      >
                        Personal
                      </div>
                      <div 
                        className="px-3 py-2 cursor-pointer hover-bg-light"
                        onClick={() => handleTypeChange('business')}
                        style={{ cursor: 'pointer' }}
                      >
                        Business
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
                onClick={() => fetchAgents()} 
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
              {searchTerm ? 'No agents found matching your search.' : 'No agents found.'}
            </div>
          ) : (
            <div className="d-flex flex-column gap-2" >
              {filteredAgents.map((agent, idx) => (
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
                  {agent.avatar ? (
                    <Image 
                      src={agent.avatar} 
                      alt={agent.fullname || 'Agent'} 
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
                      {agent.fullname || 'Unnamed Agent'}
                    </div>
                    <div style={{ color: '#888', fontSize: 14 }}>
                      Type: {getAgentType(agent)} 
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
