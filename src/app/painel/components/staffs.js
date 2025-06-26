"use client";
import React, { useState } from "react";
import Image from 'next/image';

const agents = [

    { name: "Staff 1", type: "", avatar: null },
];

function AgentDetails({ agent, onBack }) {
    // Commenting out unused state and tab logic
    // const [tab, setTab] = React.useState("individual");
    const [employeeType, setEmployeeType] = React.useState("");
    const [cpf, setCpf] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    // Example type and status, replace with real data if available
    const type = agent.type || "EVALUATOR";
    const status = "Active";
    return (
        <div>
            
            <h4 className="mt-2  fw-bold">         <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
            Staff Details</h4>
            <div style={{ maxWidth: 874, margin: '0 auto', background: '#fff', borderRadius: 16,  border: '2px solid #eee', padding: 0 }}>
                {/* Header Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 24, borderBottom: '1px solid #eee', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    {agent.avatar ? (
                        <Image 
                            src={agent.avatar} 
                            alt={agent.name} 
                            width={56}
                            height={56}
                            style={{ borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                        />
                    ) : (
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: agent.color || '#e6b1c6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }}>
                            {agent.name.split(' ').length > 1 ? agent.name.split(' ').map(n => n[0]).join('') : agent.name[0]}
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 20 }}>{agent.name}</div>
                        <div style={{ color: '#888', fontSize: 15, fontWeight: 500, marginTop: 2 }}>TYPE: {type}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ color: '#7CFC00', fontSize: 18 }}>●</span>
                            <span style={{ color: '#222', fontSize: 15 }}>{status}</span>
                        </div>
                    </div>
                </div>
                {/* Details Tab (only one) */}
                <div style={{ borderBottom: '1px solid #eee', paddingLeft: 24, paddingTop: 12 }}>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 16, borderBottom: '2px solid #2ecc40', paddingBottom: 6 }}>Details</span>
                </div>
                {/* Form */}
                <form style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Employee type</label>
                            <select value={employeeType} onChange={e => setEmployeeType(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                                <option value="">Select</option>
                                <option value="Evaluator">Evaluator</option>
                                <option value="Manager">Manager</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>CPF *</label>
                            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Full name *</label>
                            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 18 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Email *</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Password *</label>
                                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="" type="password" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                        </div>
                    </div>
                </form>
                {/* Footer Buttons */}
                
            </div>
            <div className="d-flex justify-content-end gap-5 me-5" style={{ padding: 24, background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <button style={{ background: '#e9edea', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Inactive</button>
                    <button style={{ background: '#b80000', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer'  }}>Delete</button>
                    <button style={{ background: '#7CFC00', color: '#222', border: 'none', borderRadius: 16, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Active</button>
                </div>
        </div>
    );
}

export default function AgentsPage() {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showCreate, setShowCreate] = useState(false);

    function CreateEmployeeForm() {
        const [employeeType, setEmployeeType] = useState("");
        const [cpf, setCpf] = useState("");
        const [fullName, setFullName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        return (
            <div style={{ height: '100vh', background: '#fff', width: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, overflowY: 'auto', padding: 0 }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 0 32px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Image src="/images/MadminLogo.jpg" alt="Logo" width={"auto"} height={40} style={{ height: 40 }} />
                        <button onClick={() => setShowCreate(false)} style={{ background: '#F2F5F2', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <span style={{ fontSize: 22, color: '#222' }}>&larr;</span>
                        </button>
                    </div>
                    <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: 32, color: '#222', cursor: 'pointer' }}>&times;</button>
                </div>
                <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', padding: '32px 16px' }}>
                    <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 24 }}>New Employee</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Employee type</label>
                            <select value={employeeType} onChange={e => setEmployeeType(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                                <option value="">Select</option>
                                <option value="Evaluator">Evaluator</option>
                                <option value="Manager">Manager</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>CPF *</label>
                            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Full name *</label>
                            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 18 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Email *</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Password *</label>
                                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="" type="password" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                        </div>
                        <button type="submit" style={{ background: '#7CFC00', color: '#222', border: 'none', borderRadius: 24, padding: '16px 0', fontWeight: 600, fontSize: 20, marginTop: 24, width: '100%' }}>Create employee</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-2" >
            {showCreate ? (
                <CreateEmployeeForm />
            ) : selectedAgent ? (
                <AgentDetails agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>List of Staff</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <input
                                type="text"
                                placeholder="Search Bidding"
                                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
                            />
                            <button onClick={() => setShowCreate(true)} style={{ background: '#7CFC00', border: 'none', borderRadius: 24, padding: '8px 24px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                               New Staff
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {agents.map((agent, idx) => (
                            <div
                                key={agent.name}
                                className="d-flex align-items-center gap-3 bg-transparent rounded-3 "
                                style={{ minHeight: 48, cursor: 'pointer', }}
                                onClick={() => setSelectedAgent(agent)}   >
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
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
