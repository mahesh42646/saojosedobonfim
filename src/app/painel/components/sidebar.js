"use client";
import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "./header";
import Home from "@/app/painel/components/home";
import Agents from "./culturalAgents";
import Cspace from "./culturalSpaces";
import CulturalProjects from "./culturalProjects";

import Staff from "./staffs";
import SelectionProcess from "./selectionProcess";
import Proposals from "./proposals";

const menuItems = [
  {
    label: "Home page",
    icon: "bi-house", key: "home"
  },
  { label: "Cultural Agents", icon: "bi-person-badge", key: "agents" },
  { label: "Cultural Spaces", icon: "bi-building", key: "spaces" },
  { label: "Cultural Projects", icon: "bi-folder", key: "projects" },
  { label: "Staff", icon: "bi-people", key: "staff" },
  { label: "Selection Process", icon: "bi-file-earmark-text", key: "selection" },
  { label: "Proposals", icon: "bi-calendar", key: "proposals" },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      <Header />
      <div className="d-flex container" >
        <aside className="col-4 col-lg-2  d-flex flex-column align-items-center pt-4  gap- bg-white min-vh-100" >
          <nav className="w-100 gap-2 d-flex flex-column ">
            {menuItems.map((item) => (
              <div key={item.label} className={`d-flex align-items-center gap-3  px-3 py-2 rounded-5 rounded-3 ${activeTab === item.key ? 'bg-light shadow-sm' : ''}`}
                onClick={() => setActiveTab(item.key)}  >  <span className="fs-5"><i className={item.icon}></i></span>  {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="col-8 col-lg-10" >
          {activeTab === "home" && <Home />}
          {activeTab === "agents" && <Agents />}
          {activeTab === "spaces" && <Cspace />}
          {activeTab === "projects" && <CulturalProjects />}
          {activeTab === "staff" && <Staff />}
          {activeTab === "selection" && <SelectionProcess />}
          {activeTab === "proposals" && <Proposals />}
        </main>
      </div>
    </>
  );
};

export default Sidebar; 