"use client";
import React from "react";
import Image from 'next/image';
import { useAuth } from '../authContex';

const HeaderM = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>
      <nav style={{ minHeight: 66, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px",  position: "relative" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => window.location.href = '/'}>
          <Image 
            src="/images/MadminLogo.jpg"
            alt="Gestor Cultural"
            width={120}
            height={40}
            priority
            className="img-fluid h-auto"
          />
        </div>
        
        {isAuthenticated() && (
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* <div style={{ background: "#9FE870", color: "#222", borderRadius: 20, padding: "4px 16px", fontWeight: 600, fontSize: 16 }}>
              15 mensagen
            </div> */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image 
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Coat"
                width={32}
                height={32}
                style={{ borderRadius: "50%" }}
                priority
              />
              <span className="fw-semibold fs-16 text-dark">{user?.name || 'Perfil'}</span>
              <span className="ms-3" style={{ fontSize: 20, color: "#888" }}>&#8250;</span>
            </div>
           
          </div>
        )}
      </nav>
    </div>
  );
};

export default HeaderM;
