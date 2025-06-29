import React from "react";
import Link from "next/link"; // for Next.js routing
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-white py-3 border-bottom">
            <div className="container-fluid" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="row align-items-center justify-content-between">
                    {/* Logo */}
                    <div className="col-auto d-flex align-items-center">
                        <Image src="/images/logo.png" alt="Logo" style={{ height: 70 }} width={100} height={100} />
                    </div>

                    {/* Navigation */}
                    <div className="col text-center">
                        <ul className="nav justify-content-center align-items-center gap-4">
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-house-door pe-1" style={{ fontSize: 20 }}></i> Página inicial
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/brejodocruz-pb/projetos" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-puzzle pe-1" style={{ fontSize: 20 }}></i> Projetos
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center px-3 py-1 rounded">
                                <Link href="/brejodocruz-pb/espacos" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-bank pe-1" style={{ fontSize: 20 }}></i> Espaços
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/brejodocruz-pb/agentcultural" className="fw-bold text-decoration-none" style={{ color: "#005100"}}>
                                    <i className="bi bi-people-fill pe-1" style={{ fontSize: 20 }}></i> Agentes
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/editais" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-file-earmark-text pe-1" style={{ fontSize: 20 }}></i> Editais
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Login */}
                    <div className="col-auto">
                        <Link href="/login" className="d-flex align-items-center text-decoration-none fw-bold" style={{ color: "#005100" }}>
                            <i className="bi bi-person-circle me-2" style={{ fontSize: 20 }}></i> Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

