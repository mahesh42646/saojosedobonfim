"use client";
import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mapacultural.saojosedobonfim.pb.gov.br/api';

const AddTenantModal = ({ show, onClose, onSave }) => {
  const [tenantName, setTenantName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!tenantName || !subdomain || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        tenantName,
        subdomain,
        email,
        password,
        status: active ? 'active' : 'inactive'
      });
      // Clear form
      setTenantName('');
      setSubdomain('');
      setEmail('');
      setPassword('');
      setActive(true);
    } catch (error) {
      console.error('Error saving tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ background: 'white', borderRadius: 16, padding: 32, minWidth: 380, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e5e5e5' }}>
        <h5 className="mb-3 fw-semibold">Adicionar Novo Usuário</h5>
        <div className="mb-3">
          <label className="form-label mb-1">Nome do Usuário <span className=" text-secondary">(Obrigatório)</span></label>
          <input className="form-control" placeholder="Digite o nome do usuário aqui..." value={tenantName} onChange={e => setTenantName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label mb-1">Subdomínio <span className=" text-secondary">(Obrigatório)</span></label>
          <input className="form-control" placeholder="Digite o subdomínio aqui..." value={subdomain} onChange={e => setSubdomain(e.target.value)} />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label mb-1">E-mail <span className=" text-secondary">(Obrigatório)</span></label>
            <input className="form-control" placeholder="admin@cactuspdv.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="col">
            <label className="form-label mb-1">Senha <span className=" text-secondary">(Obrigatório)</span></label>
            <input className="form-control" type="password" placeholder="Digite a senha aqui..." value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="d-flex align-items-center mb-4">
          <span className="me-2">Ativos</span>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" checked={active} onChange={() => setActive(!active)} />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-light px-4" onClick={onClose} disabled={loading}>Fechar</button>
          <button className="btn px-4" style={{ background: '#70B56A', color: 'white', fontWeight: 500 }} onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateTenantModal = ({ show, onClose, onSave, initialTenant }) => {
  const [tenantName, setTenantName] = useState(initialTenant?.tenantName || '');
  const [email, setEmail] = useState(initialTenant?.email || '');
  const [active, setActive] = useState(initialTenant?.status === 'active' || false);
  const [loading, setLoading] = useState(false);

  // Update state when initialTenant changes
  useEffect(() => {
    if (initialTenant) {
      setTenantName(initialTenant.tenantName || '');
      setEmail(initialTenant.email || '');
      setActive(initialTenant.status === 'active');
    }
  }, [initialTenant]);

  const handleSave = async () => {
    if (!tenantName || !email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        tenantName,
        email,
        status: active ? 'active' : 'inactive'
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ background: 'white', borderRadius: 16, padding: 32, minWidth: 500, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e5e5e5' }}>
        <h5 className="mb-3 fw-semibold">Atualizar Usuário</h5>
        <div className="mb-3">
          <label className="form-label mb-1">Nome do Usuário <span className=" text-secondary">(Obrigatório)</span></label>
          <input className="form-control" placeholder="Enter Tenant Name here..." value={tenantName} onChange={e => setTenantName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label mb-1">E-mail</label>
          <input className="form-control" placeholder="Enter Email here..." value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="d-flex align-items-center mb-4">
          <span className="me-2">Ativos</span>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" checked={active} onChange={() => setActive(!active)} />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light px-4" onClick={onClose} disabled={loading}>Fechar</button>
          <button className="btn px-4" style={{ background: '#70B56A', color: 'white', fontWeight: 500 }} onClick={handleSave} disabled={loading}>
            {loading ? 'Atualizando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteTenantModal = ({ show, onClose, onDelete, selectedTenant }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ background: 'white', borderRadius: 16, padding: 32, minWidth: 420, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e5e5e5', textAlign: 'center' }}>
        <h5 className="fw-semibold mb-1">Tem certeza?</h5>
        <div className="text-secondary mb-3" style={{ fontSize: 16 }}>Esta ação é irreversível</div>
        <div className="alert d-flex align-items-center mb-4" style={{ background: '#ffeaea', color: '#b91c1c', border: 'none', borderRadius: 12, padding: '12px 16px' }}>
          <div>
            <div className='d-flex align-items-center justify-content-center' >
              <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: 22 }}></i>
              <div className="fw-semibold">Atenção</div>
            </div>
            <div style={{ fontSize: 15 }}>Todos os usuários associados com &quot;{selectedTenant?.tenantName}&quot; serão permanentemente deletados</div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3 mt-2">
          <button className="btn btn-light px-4" onClick={onClose}>Cancelar</button>
          <button className="btn px-4" style={{ background: '#d32f2f', color: 'white', fontWeight: 500 }} onClick={onDelete}>Sim, Deletar</button>
        </div>
      </div>
    </div>
  );
};

const FilterModal = ({ show, onClose, onApply, from, to, setFrom, setTo }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ background: 'white', borderRadius: 16, padding: 32, minWidth: 370, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e5e5e5' }}>
        <div className="d-flex align-items-center mb-2">
          <i className="bi bi-funnel me-2" style={{ fontSize: 20, color: '#444' }}></i>
          <h5 className="fw-semibold mb-0">Filtrar</h5>
        </div>
        <div className="text-secondary mb-3" style={{ fontSize: 15 }}>Filtrar por data</div>
        <div className="row mb-4">
          <div className="col">
            <label className="form-label mb-1">De</label>
            <input className="form-control" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="col">
            <label className="form-label mb-1">Até</label>
            <input className="form-control" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light px-4" onClick={onClose}>Close</button>
          <button className="btn btn-light px-4" style={{ fontWeight: 500 }} onClick={onApply}>Aplicar</button>
        </div>
      </div>
    </div>
  );
};

const TenantsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ active: 0, inactive: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken') || 'dummy-token-for-testing'; // Use the correct dummy token for testing
    return {
      'Content-Type': 'application/json',
      'Authorization': token
    };
  };

  // Wrap fetchTenants in useCallback
  const fetchTenants = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.from) queryParams.append('from', filters.from);
      if (filters.to) queryParams.append('to', filters.to);

      const response = await fetch(`${API_BASE_URL}/tenants?${queryParams}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch tenants:', response.status);
        // For testing, use dummy data if API fails
        setTenants([]);
        setStats({ active: 0, inactive: 0, total: 0 });
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      // For testing, use dummy data if API fails
      setTenants([]);
      setStats({ active: 0, inactive: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleSave = async (tenantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tenantData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Tenant created successfully!');
        setShowModal(false);
        fetchTenants(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create tenant');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Failed to create tenant. Please check if the backend server is running on port 4000.');
    }
  };

  const handleUpdate = async (tenantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenants/${selectedTenant._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(tenantData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Tenant updated successfully!');
        setShowUpdateModal(false);
        fetchTenants(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update tenant');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Failed to update tenant. Please check if the backend server is running on port 4000.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenants/${selectedTenant._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Tenant deleted successfully!');
        setShowDeleteModal(false);
        fetchTenants(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant. Please check if the backend server is running on port 4000.');
    }
  };

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  const handleApplyFilter = () => {
    fetchTenants({
      from: filterFrom,
      to: filterTo
    });
    setShowFilterModal(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounce search to avoid too many API calls
    setTimeout(() => {
      fetchTenants({ search: value });
    }, 500);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4 py-4">
        <h4 className="text-dark mb-0">Tenants</h4>
        <button className="btn text-white ms-3" style={{ borderRadius: 20, fontWeight: 500, backgroundColor: '#70B56A', }} onClick={() => setShowModal(true)}>Add Tenant</button>
      </div>

      <AddTenantModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} />
      <UpdateTenantModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} onSave={handleUpdate} initialTenant={selectedTenant} />
      <DeleteTenantModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={handleDelete} selectedTenant={selectedTenant} />
      <FilterModal show={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={handleApplyFilter} from={filterFrom} to={filterTo} setFrom={setFilterFrom} setTo={setFilterTo} />

      <div className="row g-4 mb-4">
        <div className="col">
          <div className="bg-white rounded-5 border p-4 text-center">
            <div className="text-secondary" style={{ fontSize: 16 }}>Ativos</div>
            <div className="fw-bold" style={{ fontSize: 32, color: '#70B56A' }}>{stats.active}</div>
          </div>
        </div>
        <div className="col">
          <div className="bg-white rounded-5 border p-4 text-center">
            <div className="text-secondary" style={{ fontSize: 16 }}>Inativos</div>
            <div className="fw-bold" style={{ fontSize: 32, color: '#333' }}>{stats.inactive}</div>
          </div>
        </div>
        <div className="col">
          <div className="bg-white rounded-5 border p-4 text-center">
            <div className="text-secondary" style={{ fontSize: 16 }}>Todos</div>
            <div className="fw-bold" style={{ fontSize: 32, color: '#333' }}>{stats.total}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-5 border p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group rounded-5 border bg-light " style={{ maxWidth: 300, }}>
            <span className="input-group-text   border-0 rounded-5"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control bg-light border-0 "
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',

              }}
              onFocus={(e) => {
                e.target.style.border = 'none';
                e.target.style.outline = 'none';
                e.target.style.boxShadow = 'none';
              }}

            />
            <span className="input-group-text bg-gray-500 ms-2 rounded-5 pe-2 border-0" style={{ cursor: 'pointer' }} onClick={() => setShowFilterModal(true)}>
              <i className="bi bi-funnel"></i>
            </span>
          </div>
          <button className="btn text-white" style={{ borderRadius: 20, fontWeight: 500, backgroundColor: '#70B56A', }}>Export Ativos Tenants</button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className='text-center'>
                <th className=' col-4' style={{ border: 'none', paddingBottom: '20px' }}>Usuário</th>
                <th className=' col-2' style={{ border: 'none', paddingBottom: '20px' }}>Status</th>
                <th className=' col-3' style={{ border: 'none', paddingBottom: '20px' }}>Início da assinatura</th>
                <th className=' col-3' style={{ border: 'none', paddingBottom: '20px' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4" style={{ border: 'none' }}>Loading...</td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4" style={{ border: 'none' }}>
                    <div>No tenants found</div>
                    <div className="text-secondary" style={{ fontSize: 13 }}></div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant, index) => (
                  <tr key={tenant._id} style={{ marginBottom: '10px' }}>
                    <td colSpan="4" style={{ border: 'none', padding: '0 0 10px 0' }}>
                      <div className='text-center border  rounde' style={{
                        background: "#f8f9fa",
                        borderColor: "#e9ecef !important",
                        borderRadius: "12px",
                        padding: "16px",
                        borderRadius: "120px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <div className="d-flex align-items-center">
                              <div className="border  rounded-5 d-flex align-items-center justify-content-center" style={{
                                width: 64,
                                height: 64,
                                backgroundColor: '#ffffff',
                                borderColor: '#dee2e6'
                              }}>
                                <i className="bi bi-person" style={{ fontSize: 22, color: '#6c757d' }}></i>
                              </div>
                              <div className="ms-3 text-start">
                                <div className="fw-semibold" style={{ fontSize: 16, color: '#212529' }}>{tenant.tenantName}</div>
                                <div className="text-secondary" style={{ fontSize: 13 }}>{tenant.email}</div>
                                <div className="text-secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>{tenant.subdomain}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2 ">
                            <span className={`badge px-3 py-2 border-0 ${tenant.status === 'active' ? 'bg-white border-success' : 'bg-secondary border-secondary'}`}
                              style={{
                                borderRadius: 20,
                                color: tenant.status === 'active' ? '#198754' : 'white',
                                fontWeight: 500,
                                fontSize: '12px'
                              }}>
                              <i className={`bi ${tenant.status === 'active' ? 'bi-check2-circle' : 'bi-x-circle'} me-2`}></i>
                              {tenant.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="col-md-3">
                            <div style={{ fontSize: 14, color: '#495057' }}>
                              {new Date(tenant.subscriptionStart).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn p-0" onClick={() => handleEditClick(tenant)} title="Edit Tenant"   >
                                <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M24.5 0.5C37.7548 0.5 48.5 11.2452 48.5 24.5C48.5 37.7548 37.7548 48.5 24.5 48.5C11.2452 48.5 0.5 37.7548 0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5Z" fill="white" />
                                  <path d="M24.5 0.5C37.7548 0.5 48.5 11.2452 48.5 24.5C48.5 37.7548 37.7548 48.5 24.5 48.5C11.2452 48.5 0.5 37.7548 0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5Z" stroke="#E5E7EB" />
                                  <path d="M16.5 32.5001H20.5L31 22.0001C31.2626 21.7374 31.471 21.4256 31.6131 21.0824C31.7553 20.7393 31.8284 20.3715 31.8284 20.0001C31.8284 19.6286 31.7553 19.2608 31.6131 18.9177C31.471 18.5745 31.2626 18.2627 31 18.0001C30.7374 17.7374 30.4256 17.5291 30.0824 17.3869C29.7392 17.2448 29.3714 17.1716 29 17.1716C28.6286 17.1716 28.2608 17.2448 27.9176 17.3869C27.5744 17.5291 27.2626 17.7374 27 18.0001L16.5 28.5001V32.5001Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M26 19L30 23" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </button>

                              <button
                                className="btn p-0"

                                onClick={() => handleDeleteClick(tenant)}
                                title="Delete Tenant"
                              >
                                <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M24.5 0.5C37.7548 0.5 48.5 11.2452 48.5 24.5C48.5 37.7548 37.7548 48.5 24.5 48.5C11.2452 48.5 0.5 37.7548 0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5Z" fill="white" />
                                  <path d="M24.5 0.5C37.7548 0.5 48.5 11.2452 48.5 24.5C48.5 37.7548 37.7548 48.5 24.5 48.5C11.2452 48.5 0.5 37.7548 0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5Z" stroke="#E5E7EB" />
                                  <path d="M16.5 19.5H32.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M22.5 23.5V29.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M26.5 23.5V29.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M17.5 19.5L18.5 31.5C18.5 32.0304 18.7107 32.5391 19.0858 32.9142C19.4609 33.2893 19.9696 33.5 20.5 33.5H28.5C29.0304 33.5 29.5391 33.2893 29.9142 32.9142C30.2893 32.5391 30.5 32.0304 30.5 31.5L31.5 19.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M21.5 19.5V16.5C21.5 16.2348 21.6054 15.9804 21.7929 15.7929C21.9804 15.6054 22.2348 15.5 22.5 15.5H26.5C26.7652 15.5 27.0196 15.6054 27.2071 15.7929C27.3946 15.9804 27.5 16.2348 27.5 16.5V19.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end align-items-center mt-3">
          <nav>
            <ul className="pagination mb-0 ">
              <li className="page-item disabled"><span className="page-link">&laquo;</span></li>
              <li className="page-item disabled"><span className="page-link">&lsaquo;</span></li>
              <li className="page-item active"><span className="page-link border-0" style={{ backgroundColor: '#f7f7f7', color: 'black' }}>Mostrando {tenants.length} de {stats.total}</span></li>
              <li className="page-item disabled"><span className="page-link">&rsaquo;</span></li>
              <li className="page-item disabled"><span className="page-link">&raquo;</span></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
