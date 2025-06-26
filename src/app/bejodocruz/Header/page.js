import React from "react";
// import './page.css';
import Image from "next/image";

export default function Header() {
    return (
        <header  style={{
            background: "#fff",
            borderBottom: "2px solid #eee",
            padding: "0",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 90
        }}>
            {/* Logo and slogan */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 30 }}>
                <Image src="/images/logo.png" alt="Logo" width={77} height={77} style={{ marginBottom: 2 }} />
            </div>
            {/* Navigation */}
            <nav
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
            {/* Responsive styles for nav */}
            <style>{`
                @media (max-width: 900px) {
                    nav[style] {
                        margin: 0 2% !important;
                    }
                }
                @media (max-width: 768px) {
                    nav[style] ul {
                        flex-direction: column !important;
                        gap: 10px !important;
                    }
                    nav[style] {
                        margin: 0 2% !important;
                    }
                }
            `}</style>
            {/* Entrar button */}
            <div style={{ marginRight: 40 }}>
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
    );
} 