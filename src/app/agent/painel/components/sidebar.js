"use client"
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./home";
import Projects from "./projects.js";
import { useAccountType } from '../accountTypeContext';
import Header from "./header";
import Spaces from "./spaces";
import Profile from "./profile";


// Placeholder components for empty files
const Proposals = () => <div className="p-4">Proposals content goes here.</div>;
// const Spaces = () => <div className="p-4">Spaces content goes here.</div>;
// const Profile = () => <div className="p-4">Profile content goes here.</div>;

const menuItems = [
  { icon: "bi-house", label: "Página inicial", key: "home" },
  { icon: "bi-box-arrow-up-right", label: "Minhas propostas", key: "proposals" },
  { icon: "bi-list", label: "Meus projetos", key: "projects" },
  { icon: "bi-pc-display-horizontal", label: "Meus espaços", key: "spaces" },
  { icon: "bi-person", label: "Meu perfil", key: "profile" },
];

const tabComponents = {
  home: <Home />,
  proposals: <Proposals />,
  projects: <Projects />,
  spaces: <Spaces />,
  profile: <Profile />,
};

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const { accountType } = useAccountType();

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex  px-lg-4 p-2 " style={{ minHeight: "80vh" }}>
        <aside
          className={`sidebar col-lg-2 border ${collapsed ? "col-2" : "col-6"}  py-3 pe-2 d-flex flex-column align-items-stretch`}
          style={{ background: "#fff", minWidth: collapsed ? 60 : undefined, transition: "min-width 0.2s" }}  >
          {/* Toggle button for mobile */}
          <button
            className="btn d-lg-none  align-self-end"
            style={{ width: 50, height: 50 }}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`}></i>
          </button>
          <nav>
            <ul className="nav flex-column">
              {menuItems.map((item) => (
                <li key={item.key} className="nav-item mb-2">
                  <button
                    className={`nav-link d-flex align-items-center gap-2 p-2 rounded-pill ${activeTab === item.key ? "active bg-light border border-secondary" : ""}`}
                    style={{
                      fontSize: 16,
                      color: "#1a3300",
                      fontWeight: 600,
                      border: "none",
                      background: "none",
                      width: "100%",
                      textAlign: "left",
                      minHeight: 44,
                      justifyContent: collapsed ? "center" : "flex-start",
                      paddingLeft: collapsed ? 0 : undefined,
                      paddingRight: collapsed ? 0 : undefined,
                      transition: "all 0.2s"
                    }}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: 20 }} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* <div> {accountType}</div> */}
        </aside>
        <main
          className={
            `col-lg-10 ${collapsed ? "col-10" : "col-6"} p-lg-5 p-2`
          }
          style={{ background: "#f8f9fa" }}
        >
          {tabComponents[activeTab]}
        </main>
      </div>
    </>
  );
}
