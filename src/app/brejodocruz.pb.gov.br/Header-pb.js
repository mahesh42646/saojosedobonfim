import React from "react";
import Link from "next/link"; // for Next.js routing
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";
            
export default function Header() {
    return (
        <header className="bg-white py-2 border-bottom">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {/* Logo */}
                    <div className="col-auto d-flex align-items-center">
                        <Image src="/images/logo.png" alt="Logo" style={{ height: 70 }} width={200} height={100} />
                    </div>

                    {/* Navigation */}
                    <div className="col text-center">
                        <ul className="nav justify-content-center align-items-center gap-4">
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/brejodocruz.pb.gov.br" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-house-door pe-1" style={{ fontSize: 20 }}></i> Página inicial
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/brejodocruz.pb.gov.br/Projetos-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-puzzle pe-1" style={{ fontSize: 20 }}></i> Projetos
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center px-3 py-1 rounded">
                                <Link href="/brejodocruz.pb.gov.br/Espacos-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100" }}>
                                    <i className="bi bi-bank pe-1" style={{ fontSize: 20 }}></i> Espaços
                                </Link>
                            </li>
                            <li className="nav-item d-flex flex-column align-items-center">
                                <Link href="/brejodocruz.pb.gov.br/Agentes-Culturais" className="fw-bold text-decoration-none" style={{ color: "#005100"}}>
                                    <i className="bi bi-people-fill pe-1" style={{ fontSize: 20 }}></i> Agentes
                                </Link>
                            </li>
                            
                        </ul>
                    </div>

                    {/* Login */}
                    <div className="col-auto">
                        <Link href="/#  " className="d-flex align-items-center text-decoration-none fw-bold" style={{ color: "#005100" }}>
                            <i className="bi bi-person-circle me-2" style={{ fontSize: 20 }}></i> Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

