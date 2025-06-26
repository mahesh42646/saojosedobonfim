"use client";
import React, { useState } from "react";
import Image from 'next/image';

const agents = [
 
  { name: "Rushikesh Darkunde", type: "", avatar: null},
];

function AgentDetails({ agent, onBack }) {
  const [tab, setTab] = React.useState("individual");
  return (
    <div>
      <div className="  d-flex justify-content-between align-items-center">
        <div className="d-flex fw-bold">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
         
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}> Cultural Agent Details</h2>
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
                  alt={agent.name} 
                  width={56}
                  height={56}
                  style={{ borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: agent.color || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }}>
                  {agent.name.split(' ').length > 1 ? agent.name.split(' ').map(n => n[0]).join('') : agent.name[0]}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 20 }}>{agent.name}</div>
                <div style={{ color: '#222', fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#2ecc40', fontSize: 18 }}>●</span> Verified Agent
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="rounded-5 " style={{ background: '#F5FFF0', color: '#222', border: '1px solid rgb(216, 251, 216)', borderRadius: 16, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                Download Agent Details <span style={{ fontSize: 18 }}><i class="bi bi-download"></i></span>
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
                <input placeholder="" className="form-control p-2" />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Full name *</label>
                <input placeholder="" className="form-control p-2" />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Social name</label>
                <input placeholder="" className="form-control p-2" />
              </div>
              <div className="d-lg-flex gap-4">
              <div className="d-flex flex-column gap-2 w-50" >
                <label className="form-lable" >Gender *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="d-flex flex-column gap-2 w-50" >
                <label className="form-lable" >Breed *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Are you LGBTQIAPN+? *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Date of birth *</label>
                <input type="date" className="form-control p-2" />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >RG *</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Informações de Acessibilidade */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações de Acessibilidade</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Do you have a PCD disability? *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >In case without PCD which one?</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Informações Socioeconômicas e Educacionais */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações Socioeconômicas e Educacionais</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column gap-2" >
                <label className="form-lable" >Education *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Primary</option>
                  <option>Secondary</option>
                  <option>Higher</option>
                </select>
              </div>
              <div className="d-flex flex-column gap-2" >
                <label className="form-lable" >Individual income *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Up to 1 minimum wage</option>
                  <option>1-3 minimum wages</option>
                  <option>Above 3 minimum wages</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Beneficiary of any social program?</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Name of the social program</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Informações Profissionais */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Informações Profissionais</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Main area of activity *</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Music</option>
                  <option>Dance</option>
                  <option>Theater</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Do you belong to traditional communities?</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>(E.g.: quilombolas, indigenous people, riverside communities, etc.)</span>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Name of the social program</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Endereço */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Endereço</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >State</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>SP</option>
                  <option>RJ</option>
                  <option>MG</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >City</label>
                <select className="form-select p-2">
                  <option>Select</option>
                  <option>São Paulo</option>
                  <option>Rio de Janeiro</option>
                  <option>Belo Horizonte</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Street name and number</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Contato */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Contato</div>
            <div className="d-grid w-100 gap-3" >
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Telefone</label>
                <input placeholder="" className="form-control p-2" />
              </div>
              <div className="d-flex flex-column w-100 gap-2" >
                <label className="form-lable" >Email</label>
                <input placeholder="" className="form-control p-2" />
              </div>
            </div>
          </div>
          {/* Responsável pela Inscrição */}
          <div>
            <div className="fw-bold h5 pt-3 pb-2" >Responsável pela Inscrição</div>
            <div className="d-flex flex-column gap-2" >
              <label className="form-lable" >Name of person responsible for registration (if not the person themselves)</label>
              <input placeholder="" className="form-control p-2" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-3" >
      {selectedAgent ? (
        <AgentDetails agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>List of Cultural Agents</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Search agent"
                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
              />
              <button style={{ background: '#7CFC00', border: 'none', borderRadius: 24, padding: '8px 24px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                Filter
              </button>
            </div>
          </div>
          <div className="d-flex flex-column gap-2" >
            {agents.map((agent, idx) => (
              <div
                key={agent.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background:  'transparent',
                  borderRadius: 20,
                  
                  minHeight: 48,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAgent(agent)}
              >
                {agent.avatar ? (
                  <Image 
                    src={agent.avatar} 
                    alt={agent.name} 
                    width={36}
                    height={36}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: agent.color || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                    {agent.name.split(' ').length > 1 ? agent.name.split(' ').map(n => n[0]).join('') : agent.name[0]}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 16 }}>{agent.name}</div>
                  <div style={{ color: '#888', fontSize: 14 }}>Type:</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
