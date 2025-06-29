"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '../authContex';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const agents = [

    { name: "Staff 1", type: "", avatar: null },
];

function AgentDetails({ agent, onBack, onUpdate }) {
    const { token } = useAuth();
    const [employeeType, setEmployeeType] = useState(agent.employeeType || "");
    const [cpf, setCpf] = useState(agent.cpf || "");
    const [fullName, setFullName] = useState(agent.fullName || "");
    const [email, setEmail] = useState(agent.email || "");
    const [password, setPassword] = useState("");

    const handleStatusChange = async (newStatus) => {
        // Confirmation messages for different status changes
        const confirmMessages = {
            'active': 'Are you sure you want to activate this staff member?',
            'inactive': 'Are you sure you want to deactivate this staff member?',
            'deleted': 'Are you sure you want to delete this staff ?'
        };

        // Ask for confirmation
        if (!window.confirm(confirmMessages[newStatus])) {
            return; // If user clicks Cancel, do nothing
        }

        try {
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            };

            await axios.patch(
                `${API_BASE_URL}/staff/${agent._id}/status`, 
                { status: newStatus },
                config
            );
            
            // Update the list and local state
            onUpdate();
            agent.status = newStatus;
            
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    return (
        <div>
            <h4 className="mt-2 fw-bold">
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
                Staff Details
            </h4>
            <div style={{ maxWidth: 874, margin: '0 auto', background: '#fff', borderRadius: 16, border: '2px solid #eee', padding: 0 }}>
                {/* Header Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 24, borderBottom: '1px solid #eee' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e6b1c6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }}>
                        {agent.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 20 }}>{agent.fullName}</div>
                        <div style={{ color: '#888', fontSize: 15, fontWeight: 500, marginTop: 2 }}>TYPE: {agent.employeeType}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ 
                                color: agent.status === 'active' ? '#7CFC00' : 
                                       agent.status === 'pending' ? '#FFA500' :
                                       agent.status === 'inactive' ? '#808080' :
                                       agent.status === 'rejected' ? '#FF0000' : '#000000',
                                fontSize: 18 
                            }}>●</span>
                            <span style={{ color: '#222', fontSize: 15 }}>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Details Tab */}
                <div style={{ borderBottom: '1px solid #eee', paddingLeft: 24, paddingTop: 12 }}>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 16, borderBottom: '2px solid #2ecc40', paddingBottom: 6 }}>Details</span>
                </div>

                {/* Form */}
                <div style={{ padding: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Employee type</label>
                            <select 
                                value={employeeType} 
                                onChange={e => setEmployeeType(e.target.value)}
                                disabled
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                                <option value="">Select</option>
                                <option value="Evaluator">Evaluator</option>
                                <option value="Manager">Manager</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>CPF *</label>
                            <input 
                                value={cpf} 
                                onChange={e => setCpf(e.target.value)}
                                disabled
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Full name *</label>
                            <input 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)}
                                disabled
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 18 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Email *</label>
                                <input 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    disabled
                                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Password *</label>
                                <input 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    disabled
                                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Buttons */}
            <div className="d-flex justify-content-end gap-3" style={{ padding: '24px 0' }}>
                <button 
                    onClick={() => handleStatusChange('inactive')}
                    disabled={agent.status === 'inactive'}
                    style={{ 
                        background: '#e9edea', 
                        color: '#000', 
                        border: 'none', 
                        borderRadius: 24, 
                        padding: '8px 48px', 
                        fontWeight: 600, 
                        fontSize: 16, 
                        cursor: agent.status === 'inactive' ? 'not-allowed' : 'pointer',
                        opacity: agent.status === 'inactive' ? 0.7 : 1
                    }}>
                    Inactive
                </button>
                <button 
                    onClick={() => handleStatusChange('deleted')}
                    disabled={agent.status === 'deleted'}
                    style={{ 
                        background: '#b80000', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 24, 
                        padding: '8px 48px', 
                        fontWeight: 600, 
                        fontSize: 16, 
                        cursor: agent.status === 'deleted' ? 'not-allowed' : 'pointer',
                        opacity: agent.status === 'deleted' ? 0.7 : 1
                    }}>
                    Delete
                </button>
                <button 
                    onClick={() => handleStatusChange('active')}
                    disabled={agent.status === 'active'}
                    style={{ 
                        background: '#7CFC00', 
                        color: '#222', 
                        border: 'none', 
                        borderRadius: 24, 
                        padding: '8px 48px', 
                        fontWeight: 600, 
                        fontSize: 16, 
                        cursor: agent.status === 'active' ? 'not-allowed' : 'pointer',
                        opacity: agent.status === 'active' ? 0.7 : 1
                    }}>
                    Active
                </button>
            </div>
        </div>
    );
}

export default function AgentsPage() {
    const { token, isAuthenticated } = useAuth();
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("status"); // 'status', 'newest', 'oldest'

    const fetchStaffList = useCallback(async () => {
        try {
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.get(`${API_BASE_URL}/staff`, config);
            setStaffList(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthenticated()) {
            fetchStaffList();
        }
    }, [fetchStaffList, isAuthenticated]);

    // Filter and sort staff list
    const getFilteredAndSortedStaff = () => {
        let filtered = [...staffList];

        // First apply search filter
        filtered = filtered.filter(staff => 
            staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Then apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(staff => staff.status === statusFilter);
        }

        // Then apply sorting
        switch (sortOrder) {
            case "status":
                // Custom status order: active -> pending -> inactive -> deleted
                const statusOrder = { active: 1, pending: 2, inactive: 3, deleted: 4 };
                filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
                break;
            default:
                break;
        }

        return filtered;
    };

    function CreateEmployeeForm() {
        const [employeeType, setEmployeeType] = useState("");
        const [cpf, setCpf] = useState("");
        const [fullName, setFullName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");

            try {
                await axios.post(`${API_BASE_URL}/staff`, {
                    employeeType,
                    cpf,
                    fullName,
                    email,
                    password
                }, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                
                // Refresh staff list and close form
                await fetchStaffList();
                setShowCreate(false);
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to create staff member');
            }
        };

        return (
            <div style={{ height: '100vh', background: '#fff', width: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, overflowY: 'auto', padding: 0 }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 0 32px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Image 
                            src="/images/MadminLogo.jpg" 
                            alt="Logo" 
                            width={40} 
                            height={40} 
                            style={{ height: 40, width: 'auto', objectFit: 'contain' }} 
                        />
                        <button onClick={() => setShowCreate(false)} style={{ background: '#F2F5F2', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <span style={{ fontSize: 22, color: '#222' }}>&larr;</span>
                        </button>
                    </div>
                    <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: 32, color: '#222', cursor: 'pointer' }}>&times;</button>
                </div>
                <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', padding: '32px 16px' }}>
                    <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 24 }}>New Employee</h3>
                    {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Employee type</label>
                            <select 
                                value={employeeType} 
                                onChange={e => setEmployeeType(e.target.value)}
                                required 
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                                <option value="">Select</option>
                                <option value="Evaluator">Evaluator</option>
                                <option value="Manager">Manager</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>CPF *</label>
                            <input 
                                value={cpf} 
                                onChange={e => setCpf(e.target.value)}
                                required
                                placeholder="" 
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontWeight: 500 }}>Full name *</label>
                            <input 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)}
                                required
                                placeholder="" 
                                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 18 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Email *</label>
                                <input 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    type="email"
                                    placeholder="" 
                                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label style={{ fontWeight: 500 }}>Password *</label>
                                <input 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    type="password" 
                                    placeholder="" 
                                    style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            style={{ background: '#7CFC00', color: '#222', border: 'none', borderRadius: 24, padding: '16px 0', fontWeight: 600, fontSize: 20, marginTop: 24, width: '100%', cursor: 'pointer' }}>
                            Create employee
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // If not authenticated, you might want to show a message or redirect
    if (!isAuthenticated()) {
        return <div>Please log in to access this page.</div>;
    }

    return (
        <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-2" >
            {showCreate ? (
                <CreateEmployeeForm />
            ) : selectedAgent ? (
                <AgentDetails 
                    agent={selectedAgent} 
                    onBack={() => setSelectedAgent(null)}
                    onUpdate={fetchStaffList}
                />
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>List of Staff</h2>
                        <div className="d-flex align-items-center w-50 gap-3">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="form-select"
                                style={{ 
                                    border: '1px solid #ccc', 
                                    borderRadius: 24, 
                                    // padding: '6px 24px', 
                                    outline: 'none',
                                    fontSize: 14
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Inactive</option>
                                <option value="deleted">Deleted</option>
                            </select>

                            {/* Sort Order */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="form-select"
                                style={{ 
                                    border: '1px solid #ccc', 
                                    borderRadius: 24, 
                                
                                    outline: 'none',
                                    fontSize: 14
                                }}
                            >
                                <option value="status">By Status</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>

                            {/* Search Input */}
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Staff"
                                className="form-control"
                                style={{ 
                                    border: '1px solid #ccc', 
                                    borderRadius: 24, 
                                    // padding: '6px 24px', 
                                    outline: 'none', 
                                    width: 200 
                                }}
                            />

                            {/* New Staff Button */}
                            <button 
                                onClick={() => setShowCreate(true)} 
                                className="btn rounded-5 "
                                style={{   background: '#7CFC00', minWidth: '160px'  }}>
                                New Staff
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {getFilteredAndSortedStaff().map((staff) => (
                            <div
                                key={staff._id}
                                className="d-flex align-items-center gap-3 bg-transparent rounded-3"
                                style={{ minHeight: 48, cursor: 'pointer', padding: '8px 16px', border: '1px solid #eee' }}
                                onClick={() => setSelectedAgent(staff)}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e6b1c6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                                    {staff.fullName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>{staff.fullName}</div>
                                    <div style={{ color: '#888', fontSize: 14 }}>{staff.email}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ 
                                        color: staff.status === 'active' ? '#7CFC00' : 
                                               staff.status === 'pending' ? '#FFA500' :
                                               staff.status === 'inactive' ? '#808080' :
                                               staff.status === 'rejected' ? '#FF0000' : '#000000',
                                        fontSize: 18 
                                    }}>●</span>
                                    <span style={{ color: '#222', fontSize: 14 }}>{staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
