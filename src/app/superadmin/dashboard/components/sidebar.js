"use client";
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-5 p-3 mb-4 mb-lg-0" style={{ minWidth: 180, }}>
      <ul className="nav flex-lg-column flex-row gap-2">
        {/* <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center fw-bold hover-effect ${activeTab === 'dashboard' ? 'active text-success active-bg' : 'text-dark'}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="me-2"><i className="bi bi-grid"></i></span> Dashboard
          </button>
        </li> */}
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center hover-effect ${activeTab === 'tenants' ? 'active text-success active-bg' : 'text-dark active active-bg'}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            onClick={() => setActiveTab('tenants')}
          >
            <span className="me-2"><i className="bi bi-people"></i></span> Tenants
          </button>
        </li>
      </ul>
      <style>{`
        .hover-effect:hover {
          background-color:rgb(224, 226, 224) !important;
          color:rgb(3, 17, 10) !important;
          border-radius: 0.5rem;
        }
        .active-bg, .nav-link.active {
          background-color:rgb(241, 244, 241) !important;
          border-radius: 0.5rem;
          color:rgb(3, 17, 10) !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 