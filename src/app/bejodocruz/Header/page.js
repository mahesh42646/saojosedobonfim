'use client'
import React, { useState } from "react";
// import './page.css';
import Image from "next/image";

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <header style={{
                background: "#fff",
                borderBottom: "2px solid #eee",
                padding: "0",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 90,
                position: "relative",
                zIndex: 1000
            }}>
                {/* Logo and slogan */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 30 }}>
                    <Image src="/images/Logo-sjdb.png" alt="Logo" width={77} height={77} style={{ marginBottom: 2 }} />
                </div>

                {/* Desktop Navigation */}
                <nav
                    className="desktop-nav"
                    style={{
                        flex: 1,
                        margin: '0 20%',
                        maxWidth: 1199,
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        width: 'auto',
                    }}
                >
                    <ul
                        style={{
                            display: 'flex',
                            gap: 20,
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center',
                        }}
                    >
                        <li style={{ textAlign: "center" }}>
                            <div style={{
                                background: "#137c0b",
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto"
                            }}>
                                <span style={{ fontSize: 26, color: "#fff" }}><i className="bi bi-house-door-fill"></i></span>
                            </div>
                            <div style={{ color: "#137c0b", fontWeight: "bold", fontSize: 15, marginTop: 2 }}>Início</div>
                        </li>
                        <li style={{ textAlign: "center" }}>
                            <div style={{
                                background: "#137c0b",
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto"
                            }}>
                                <span style={{ fontSize: 26, color: "#fff" }}><i className="bi bi-puzzle"></i></span>
                            </div>
                            <div style={{ color: "#137c0b", fontWeight: "bold", fontSize: 15, marginTop: 2 }}>Projetos</div>
                        </li>
                        <li style={{ textAlign: "center" }}>
                            <div style={{
                                background: "#137c0b",
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto"
                            }}>
                                <span style={{ fontSize: 26, color: "#fff" }}><i className="bi bi-bank"></i></span>
                            </div>
                            <div style={{ color: "#137c0b", fontWeight: "bold", fontSize: 15, marginTop: 2 }}>Espaços</div>
                        </li>
                        <li style={{ textAlign: "center" }}>
                            <div style={{
                                background: "#137c0b",
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto"
                            }}>
                                <span style={{ fontSize: 26, color: "#fff" }}><i className="bi bi-people-fill"></i></span>
                            </div>
                            <div style={{ color: "#137c0b", fontWeight: "bold", fontSize: 15, marginTop: 2 }}>Agentes</div>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Hamburger Menu */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleSidebar}
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        fontSize: 28,
                        color: "#137c0b",
                        cursor: "pointer",
                        padding: 10,
                        marginRight: 20
                    }}
                >
                    <i className="bi bi-list"></i>
                </button>

                {/* Entrar button */}
                <div className="entrar-btn" style={{ marginRight: 40 }}>
                    <a href="#" style={{
                        color: "#fff",
                        background: "#137c0b",
                        borderRadius: 22,
                        padding: "10px 32px",
                        fontWeight: "bold",
                        fontSize: 16,
                        textDecoration: "none"
                    }}>Entrar</a>
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
                    <h3 style={{ margin: 0, color: "#137c0b", fontSize: 18 }}>Menu</h3>
                    <button
                        onClick={closeSidebar}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: 24,
                            color: "#137c0b",
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
                            <a href="#" style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#137c0b",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#137c0b",
                                    borderRadius: "50%",
                                    width: 35,
                                    height: 35,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 15
                                }}>
                                    <i className="bi bi-house-door-fill" style={{ fontSize: 18, color: "#fff" }}></i>
                                </div>
                                Início
                            </a>
                        </li>
                        <li>
                            <a href="#" style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#137c0b",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#137c0b",
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
                            </a>
                        </li>
                        <li>
                            <a href="#" style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#137c0b",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#137c0b",
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
                            </a>
                        </li>
                        <li>
                            <a href="#" style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "15px 20px",
                                textDecoration: "none",
                                color: "#137c0b",
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: 16,
                                fontWeight: "bold"
                            }}>
                                <div style={{
                                    background: "#137c0b",
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
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Sidebar Footer - Entrar button */}
                <div style={{ padding: "20px" }}>
                    <a href="#" style={{
                        display: "block",
                        textAlign: "center",
                        color: "#fff",
                        background: "#137c0b",
                        borderRadius: 22,
                        padding: "12px 20px",
                        fontWeight: "bold",
                        fontSize: 16,
                        textDecoration: "none"
                    }}>Entrar</a>
                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
                /* Desktop styles - keep existing navigation visible */
                @media (min-width: 901px) {
                    .desktop-nav {
                        display: flex !important;
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
                    header div:first-child {
                        margin-left: 15px !important;
                    }
                }

                /* Sidebar animations and interactions */
                .sidebar a:hover {
                    background-color: #f8f9fa !important;
                }

                .mobile-menu-btn:hover {
                    background-color: #f8f9fa !important;
                    border-radius: 5px !important;
                }

                /* Prevent body scroll when sidebar is open */
                ${sidebarOpen ? 'body { overflow: hidden; }' : ''}
            `}</style>
        </>
    );
} 