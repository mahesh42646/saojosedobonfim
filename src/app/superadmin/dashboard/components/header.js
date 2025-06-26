"use client";
import React from 'react';
import Image from 'next/image';

const HeaderAdmin = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top" style={{ minHeight: 66, zIndex: 10 }}>
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Image 
            src="/images/superAlogo.png" 
            alt="Logo" 
            width={160}
            height={48}
            
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <Image 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Admin" 
            width={36}
            height={36}
            className="rounded-circle"
          />
          <span className="fw-medium fs-6 text-dark ms-2">Marcos Lisboa</span>
        </div>
      </div>
    </nav>
  );
};

export default HeaderAdmin;