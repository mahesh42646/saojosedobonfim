"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { useAccountType } from '../accountTypeContext';
import { FaChevronDown } from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

const TYPE_DISPLAY = {
    personal: {
        name: (profile) => profile.fullname || 'Personal Account',
        initials: (profile) => profile.fullname ? profile.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P',
    },
    business: {
        name: (profile) => profile.businessData?.razaoSocial || 'Business Account',
        initials: (profile) => {
            const name = profile.businessData?.razaoSocial || 'B';
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        },
    },
    collective: {
        name: (profile) => profile.collectiveData?.collectiveName || 'Collective Account',
        initials: (profile) => {
            const name = profile.collectiveData?.collectiveName || 'C';
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        },
    },
};

function Header() {
    const { accountType, updateAccountType } = useAccountType();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = localStorage.getItem('agentUser');
                const token = localStorage.getItem('agentToken');
                if (!userData || !token) return;

                const user = JSON.parse(userData);
                const response = await fetch(`${API_BASE_URL}/agent/profile/${user.cpf}`, {
                // const response = await fetch(`https://mapacultural.gestorcultural.com.br/api/agent/profile/${user.cpf}`, {
                    headers: { 'Authorization': token }
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const getCurrentDisplayName = () => {
        if (!profile || !accountType) return 'Loading...';
        return TYPE_DISPLAY[accountType]?.name(profile);
    };

    const getCurrentInitials = () => {
        if (!profile || !accountType) return '...';
        return TYPE_DISPLAY[accountType]?.initials(profile);
    };

    return (
        <Navbar className="bg-white border-bottom py-2">
            <Container fluid className="px-5">
                <Navbar.Brand href="#" className="d-flex align-items-center">
                    <Image
                        src="/images/MadminLogo.jpg"
                        alt="Gestor Cultural"
                        width={160}
                        height={40}
                        className="object-fit-contain"
                    />
                </Navbar.Brand>

                <div className="d-flex align-items-center gap-3">
                    <span className="bg-success-subtle text-dark d-none d-lg-block rounded-pill px-3 py-1">
                        15 mensagens
                    </span>

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            as="div"
                            className="d-flex align-items-center gap-2 cursor-pointer"
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px', fontSize: '16px' }}
                                >
                                    {getCurrentInitials()}
                                </div>
                                <span className="ms-2 fw-medium d-none d-lg-block">{getCurrentDisplayName()}</span>
                                {/* <FaChevronDown className="ms-2" size={12} /> */}
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-0 my-2 rounded-3 shadow">
                            {profile && Object.keys(TYPE_DISPLAY).map((type) => {
                                const isComplete = profile.typeStatus[type]?.isComplete;
                                if (!isComplete) return null; // Skip incomplete accounts

                                return (
                                    <Dropdown.Item key={type} onClick={() => updateAccountType(type)} active={accountType === type} className="d-flex align-items-center gap-2 py-2 text-dark rounded-3"
                                        style={{ backgroundColor: accountType === type ? '#9FE870' : 'transparent' }}
                                    >
                                        <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', fontSize: '14px' }} >
                                            {TYPE_DISPLAY[type].initials(profile)}
                                        </div>
                                        <div>
                                            <p className="m-0">{TYPE_DISPLAY[type].name(profile)}</p>
                                            <p className="m-0">{type}</p>
                                        </div>
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default Header;
