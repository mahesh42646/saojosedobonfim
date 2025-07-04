import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"; // for Next.js routing
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <>
            <header className="bg-white py-2 border-bottom" style={{ position: "relative", zIndex: 9998 }}>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        {/* Logo */}
                        <div className="col-auto d-flex align-items-center">
                        <div onClick={() => window.location.href = '/'}>
                              <Image src="/images/Logo-sjdb.png" alt="Logo" style={{ height: 70, cursor: 'pointer' }} width={200} height={100} />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="col text-center desktop-nav">
                            <ul className="nav justify-content-center align-items-center gap-4">
                                <li className="nav-item d-flex flex-column align-items-center">
                                    <Link href="/PTBR" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                        <i className="bi bi-house-door pe-1" style={{ fontSize: 20 }}></i> Página inicial
                                    </Link>
                                </li>
                                <li className="nav-item d-flex flex-column align-items-center">
                                    <Link href="/PTBR/Projetos-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                        <i className="bi bi-puzzle pe-1" style={{ fontSize: 20 }}></i> Projetos
                                    </Link>
                                </li>
                                <li className="nav-item d-flex flex-column align-items-center px-3 py-1 rounded">
                                    <Link href="/PTBR/Espacos-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                        <i className="bi bi-bank pe-1" style={{ fontSize: 20 }}></i> Espaços
                                    </Link>
                                </li>
                                <li className="nav-item d-flex flex-column align-items-center">
                                    <Link href="/PTBR/Agentes-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100"}}>
                                        <i className="bi bi-people-fill pe-1" style={{ fontSize: 20 }}></i> Agentes
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>

                        {/* Mobile Hamburger Menu */}
                        <div className="col-auto mobile-menu-btn" style={{ display: "none" }}>
                            <button
                                onClick={toggleSidebar}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: 28,
                                    color: "#005100",
                                    cursor: "pointer",
                                    padding: 10
                                }}
                            >
                                <i className="bi bi-list"></i>
                            </button>
                        </div>

                        {/* Login Dropdown */}
                        <div className="col-auto entrar-btn dropdown-container" ref={dropdownRef}>
                            <div 
                                onClick={toggleDropdown}
                                className="d-flex align-items-center text-decoration-none fw-bold"
                                style={{ color: "#005100", cursor: "pointer" }}
                            >
                                <i className="bi bi-person-circle me-2" style={{ fontSize: 20 }}></i> Entrar
                                <i className={`bi bi-chevron-down ms-1 ${dropdownOpen ? 'rotate' : ''}`} style={{ fontSize: 14, transition: 'transform 0.2s' }}></i>
                            </div>
                            
                            {dropdownOpen && (
                                <div className="dropdown-menu" style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    minWidth: "150px",
                                    zIndex: 9999,
                                    marginTop: "5px"
                                }}>
                                    <div 
                                        onClick={() => {
                                            router.push('/painel');
                                            closeDropdown();
                                        }}
                                        className="dropdown-item"
                                        style={{
                                            padding: "10px 15px",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s",
                                            borderBottom: "1px solid #f0f0f0",
                                            display: "flex",
                                            alignItems: "center",
                                            color: "#005100",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        <i className="bi bi-shield-check me-2"></i>
                                        Admin
                                    </div>
                                    <div 
                                        onClick={() => {
                                            router.push('/agent/painel');
                                            closeDropdown();
                                        }}
                                        className="dropdown-item"
                                        style={{
                                            padding: "10px 15px",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s",
                                            display: "flex",
                                            alignItems: "center",
                                            color: "#005100",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        <i className="bi bi-person-badge me-2"></i>
                                        Agente
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <div
                className="sidebar-overlay"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1500,
                    display: sidebarOpen ? "block" : "none",
                }}
                onClick={closeSidebar}
            ></div>

            <div
                className="sidebar"
                style={{
                    position: "fixed",
                    top: 0,
                    right: sidebarOpen ? "0" : "-300px",
                    width: "300px",
                    height: "100%",
                    backgroundColor: "#fff",
                    zIndex: 2000,
                    transition: "right 0.3s ease-in-out",
                    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px 0"
                }}
            >
                {/* Sidebar Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px 20px",
                    borderBottom: "1px solid #eee",
                    marginBottom: 20
                }}>
                    <h3 style={{ margin: 0, color: "#005100", fontSize: 18 }}>Menu</h3>
                    <button
                        onClick={closeSidebar}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: 24,
                            color: "#005100",
                            cursor: "pointer",
                            padding: 5
                        }}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav style={{ flex: 1 }}>
                    <ul style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0
                    }}>
                        <li>
                            <Link href="/PTBR" onClick={closeSidebar} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#005100",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#005100",
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 15
                                }}>
                                    <i className="bi bi-house-door" style={{ fontSize: 18, color: "#fff" }}></i>
                                </div>
                                Página inicial
                            </Link>
                        </li>
                        <li>
                            <Link href="/PTBR/Projetos-Culturais" onClick={closeSidebar} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#005100",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#005100",
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 15
                                }}>
                                    <i className="bi bi-puzzle" style={{ fontSize: 18, color: "#fff" }}></i>
                                </div>
                                Projetos
                            </Link>
                        </li>
                        <li>
                            <Link href="/PTBR/Espacos-Culturais" onClick={closeSidebar} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#005100",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#005100",
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 15
                                }}>
                                    <i className="bi bi-bank" style={{ fontSize: 18, color: "#fff" }}></i>
                                </div>
                                Espaços
                            </Link>
                        </li>
                        <li>
                            <Link href="/PTBR/Agentes-Culturais" onClick={closeSidebar} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#005100",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#005100",
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 15
                                }}>
                                    <i className="bi bi-people-fill" style={{ fontSize: 18, color: "#fff" }}></i>
                                </div>
                                Agentes
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Sidebar Footer - Entrar dropdown */}
                <div style={{ padding: "20px" }}>
                    <div 
                        onClick={toggleDropdown}
                        style={{
                            display: "block",
                            textAlign: "center",
                            color: "#fff",
                            background: "#005100",
                            borderRadius: 22,
                            padding: "12px 20px",
                            fontWeight: "bold",
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                    >
                        <i className="bi bi-person-circle me-2"></i>
                        Entrar
                        <i className={`bi bi-chevron-down ms-1 ${dropdownOpen ? 'rotate' : ''}`} style={{ fontSize: 14, transition: 'transform 0.2s' }}></i>
                    </div>
                    
                    {dropdownOpen && (
                        <div style={{
                            marginTop: "10px",
                            background: "#fff",
                            borderRadius: "10px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            zIndex: 1001
                        }}>
                            <div 
                                onClick={() => {
                                    router.push('/painel');
                                    closeDropdown();
                                    closeSidebar();
                                }}
                                style={{
                                    padding: "12px 20px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#005100",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="bi bi-shield-check me-2"></i>
                                Admin
                            </div>
                            <div 
                                onClick={() => {
                                    router.push('/agent');
                                    closeDropdown();
                                    closeSidebar();
                                }}
                                style={{
                                    padding: "12px 20px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#005100",
                                    fontWeight: "bold"
                                }}
                            >
                                <i className="bi bi-person-badge me-2"></i>
                                Agente
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
                /* Dropdown styles */
                .dropdown-container {
                    position: relative;
                    z-index: 9999;
                }

                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    min-width: 150px;
                    z-index: 9999;
                    margin-top: 5px;
                    display: block !important;
                }

                .dropdown-item {
                    padding: 10px 15px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    align-items: center;
                    color: #005100;
                    font-weight: bold;
                }

                .dropdown-item:last-child {
                    border-bottom: none;
                }

                .dropdown-item:hover {
                    background-color: #f8f9fa;
                }

                .rotate {
                    transform: rotate(180deg);
                }

                /* Desktop styles - keep existing navigation visible */
                @media (min-width: 901px) {
                    .desktop-nav {
                        display: block !important;
                    }
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    .entrar-btn {
                        display: block !important;
                    }
                }

                /* Tablet and Mobile styles */
                @media (max-width: 900px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }

                /* Small mobile adjustments */
                @media (max-width: 480px) {
                    .entrar-btn {
                        display: none !important;
                    }
                    .sidebar {
                        width: 280px !important;
                        right: ${sidebarOpen ? "0" : "-280px"} !important;
                    }
                }

                /* Sidebar animations and interactions */
                .sidebar a:hover {
                    background-color: #f8f9fa !important;
                }

                .mobile-menu-btn button:hover {
                    background-color: #f8f9fa !important;
                    border-radius: 5px !important;
                }

                /* Prevent body scroll when sidebar is open */
                ${sidebarOpen ? 'body { overflow: hidden; }' : ''}
            `}</style>
        </>
    );
}

