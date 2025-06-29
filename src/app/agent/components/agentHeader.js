import React from "react";
import Image from "next/image";
const AgentHeader = () => {
  return (
    <div className="container py-2 border-bottom" style={{ background: '#fff' }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Left: Logo and Text */}
        <div className="d-flex align-items-center">
          <Image src="/images/MadminLogo.jpg" alt="Gestor Cultural Logo" width={160} height={50} style={{ marginRight: 8 }} />
          
        </div>
        {/* Right: Icons */}
        <div className="d-flex align-items-center gap-3">
          <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ background: '#D9DED9', width: 48, height: 48 }}>
            {/* Calendar Icon (placeholder SVG) */}
            <svg width="24" height="24" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </span>
          <span className="d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, cursor: 'pointer' }}>
            {/* Close Icon (X, placeholder SVG) */}
            <svg width="28" height="28" fill="none" stroke="#1A2530" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentHeader;
