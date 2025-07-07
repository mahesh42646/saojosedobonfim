"use client";
import React, { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "@/app/painel/components/home";
import Agents from "./culturalAgents";
import Cspace from "./culturalSpaces";
import CulturalProjects from "./culturalProjects";
import Image from 'next/image';
import Staff from "./staffs";
import SelectionProcess from "./selectionProcess";
import Proposals from "./proposals";
import Profile from "./profile";
import { useAuth } from '../authContex';

const menuItems = [
  {
    label: "Página inicial",
    icon: "bi-house", key: "home"
  },
  { label: "Agentes Culturais", icon: "bi-person-badge", key: "agents" },
  { label: "Espaços Culturais", icon: "bi-building", key: "spaces" },
  { label: "Projetos Culturais", icon: "bi-folder", key: "projects" },
  { label: "Equipe", icon: "bi-people", key: "staff" },
  { label: "Processo Seletivo", icon: "bi-file-earmark-text", key: "selection" },
  { label: "Propostas", icon: "bi-calendar", key: "proposals" },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [adminData, setAdminData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/profile`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
        } else {
          console.error('Failed to fetch admin profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (token) {
      fetchAdminProfile();
    }
  }, [token]);

  return (
    <>

      <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>
        <nav style={{ minHeight: 66, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image
              src="/images/MadminLogo.jpg"
              alt="Gestor Cultural"
              width={120}
              height={40}
              priority
              className="img-fluid h-auto"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ background: "#9FE870", color: "#222", borderRadius: 20, padding: "4px 16px", fontWeight: 600, fontSize: 16 }}>
              15 mensagens
            </div>
            <div id="user-profile"
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              onClick={() => setActiveTab("profile")}
            >
              {adminData?.profilePhoto && adminData.profilePhoto.trim() ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${adminData.profilePhoto.trim()}`}
                  alt="Perfil"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%", objectFit: 'cover' }}
                  priority
                />
              ) : (
                <Image
                  src="/images/placeholder-Avatar.png"
                  alt="Perfil Padrão"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%", objectFit: 'cover' }}
                  priority
                />
              )}
              <span id="user-name" className="fw-semibold fs-16 text-dark">{adminData?.name || 'Loading...'}</span>
              <span className="ms-3" style={{ fontSize: 20, color: "#888" }}>&#8250;</span>
            </div>

          </div>
          {/* )} */}
        </nav>
      </div>
      {/* <Header /> */}
      <div id="sidebar" className="d-flex container  p-2" >
        <aside className="col-4 col-lg-2  d-flex flex-column align-items-center pt-4 bg-white" style={{ minHeight: '92vh' }} >
          <nav className="w-100 gap-2 d-flex flex-column ">
            {menuItems.map((item) => (
              <div key={item.label} className={`d-flex align-items-center gap-3  p-3 rounded-5 rounded-3 ${activeTab === item.key ? 'bg-secondary-lite shadow-sm' : ''}`}
                onClick={() => setActiveTab(item.key)}  >  <span className="fs-5"><i className={item.icon}></i></span>  {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="col-8 py-lg-5 p-2 col-lg-10" >
          {activeTab === "home" && <Home />}
          {activeTab === "agents" && <Agents />}
          {activeTab === "spaces" && <Cspace />}
          {activeTab === "projects" && <CulturalProjects />}
          {activeTab === "staff" && <Staff />}
          {activeTab === "selection" && <SelectionProcess />}
          {activeTab === "proposals" && <Proposals />}
          {activeTab === "profile" && <Profile />}
        </main>
      </div>
    </>
  );
};

export default Sidebar; 