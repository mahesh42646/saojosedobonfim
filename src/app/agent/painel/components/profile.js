"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera, FaChevronRight, FaUser, FaLock, FaSignOutAlt, FaPlus, FaUsers, FaShieldAlt, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { useAccountType } from '../accountTypeContext';
import PublicProfileModal from './PublicProfileModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://teste.mapadacultura.com/api';

const TYPE_DISPLAY = {
  personal: {
    label: "Conta pessoa física",
    username: (profile) => profile.username || "",
    name: (profile) => profile.fullname || "",
    avatar: (profile) => profile.avatarUrl || null,
    initials: (profile) => profile.fullname ? profile.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P',
  },
  business: {
    label: "Conta pessoa jurídica",
    name: (profile) => profile.businessData?.razaoSocial || "",
    initials: (profile) => {
      const name = profile.businessData?.razaoSocial || 'B';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
  },
  collective: {
    label: "Sua conta coletivo",
    name: (profile) => profile.collectiveData?.collectiveName || "",
    initials: (profile) => {
      const name = profile.collectiveData?.collectiveName || 'C';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
  },
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { accountType, updateAccountType } = useAccountType();
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem("agentUser");
        const token = localStorage.getItem("agentToken");
        if (!userData || !token) return;

        const user = JSON.parse(userData);
        const response = await fetch(
          `${API_BASE_URL}/agent/profile/${user.cpf}`,
          // `https://mapacultural.gestorcultural.com.br/api/agent/profile/${user.cpf}`,

          {
            headers: { Authorization: token },
          }
        );

        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const currentType = TYPE_DISPLAY[accountType];
  
  // Get current profile photo for the selected account type
  const getCurrentProfilePhoto = () => {
    const profilePhoto = profile.profilePhotos?.[accountType];
    if (profilePhoto && profilePhoto.trim()) {
      return `${API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto.trim()}`;
    }
    return "/images/placeholder-Avatar.png";
  };

  return (
    <div className="d-lg-flex justify-content-center align-items-start gap-5 p-5" >
      {/* Left: Profile Card */}
      <div className="col-lg-6">
        <div className="bg-body-secondary rounded-4 p-4 d-flex flex-column align-items-center mb-4">
          <div className="position-relative mb-3">
            <Image
              src={getCurrentProfilePhoto()}
              alt="Profile Photo"
              width={80}
              height={80}
              className="rounded-circle border-dark object-fit-cover"
              onError={(e) => {
                e.target.src = "/images/placeholder-Avatar.png";
              }}
            />
            <span
              className="position-absolute bottom-0 end-0 bg-light rounded-circle p-1"
              style={{ border: "2px solid #fff", cursor: "pointer" }}
              onClick={() => setShowPublicProfileModal(true)}
            >
              <FaCamera color="#2E7D32" />
            </span>
          </div>
          <h3 className="fw-bold mb-1 w- overflow-hidden " >
            {currentType.name(profile)}
          </h3>
          <div className="mb-2" style={{ color: "#222"  }}>
            {currentType.label}
          </div>
          
        </div>

        {/* Other Accounts */}
        {Object.keys(TYPE_DISPLAY).map((type) => {
          if (type === accountType || !profile.typeStatus[type]?.isComplete) return null;
          
          const typeDisplay = TYPE_DISPLAY[type];
          return (
            <div 
              key={type}
              className="bg-body-secondary rounded-4 p-3 d-flex align-items-center mb-3" 
              style={{ minHeight: 70 }}
              onClick={() => updateAccountType(type)}
            >
              <div className="rounded-circle bg-body text-dark d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: 48, height: 48, fontSize: 20 }}>
                {typeDisplay.initials(profile)}
              </div>
              <div>
                <div className="fw-bold">{typeDisplay.name(profile)}</div>
                <div className="text-secondary" style={{ fontSize: 15 }}>{typeDisplay.label}</div>
              </div>
              <FaChevronRight className="ms-auto text-secondary" />
            </div>
          );
        })}

        {/* Open another account */}
        <div className="border border-dashed rounded-4 p-3 d-flex align-items-center mb-4" style={{ minHeight: 70 }}>
          <div className="rounded-circle bg-body text-dark d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, fontSize: 20, border: "1.5px solid #9FE870" }}>
            <FaPlus color="#7AC142" />
          </div>
          <div className="fw-semibold" style={{ color: "#222" }}>Abrir outra conta</div>
          <FaChevronRight className="ms-auto text-secondary" />
        </div>

        {/* Logout */}
        <button className="btn btn-light rounded-pill w-100 fw-bold" style={{ color: "#2E7D32", border: "none" }}>
          Sair
        </button>
      </div>

      {/* Right: Settings */}
      <div  className="col-lg-6">
        <h2 className="fw-bold mb-4" >Configurações</h2>
        <div className="d-flex flex-column gap-2">
          <div 
            className="d-flex align-items-center bg-body-secondary rounded-pill p-3 mb-2" 
            style={{ minHeight: 60, cursor: "pointer" }}
            onClick={() => setShowPublicProfileModal(true)}
          >
            <span className="bg-body rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 44, height: 44 }}>
              <FaUser size={20} />
            </span>
            <div>
              <div className="fw-bold">Perfil Público</div>
              <div className="text-secondary" style={{ fontSize: 15 }}>Atualize os seus dados público.</div>
            </div>
            <FaChevronRight className="ms-auto text-secondary" />
          </div>
          <div className="d-flex align-items-center bg-body-secondary rounded-pill p-3">
            <span className="bg-body rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 44, height: 44 }}>
              <FaUsers size={20} />
            </span>
            <div>
              <div className="fw-bold">Dados pessoais</div>
              <div className="text-secondary" style={{ fontSize: 15 }}>Atualize os seus dados pessoais.</div>
            </div>
            <FaChevronRight className="ms-auto text-secondary" />
          </div>
          <div className="d-flex align-items-center bg-body-secondary rounded-pill p-3">
            <span className="bg-body rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 44, height: 44 }}>
              <FaShieldAlt size={20} />
            </span>
            <div>
              <div className="fw-bold">Segurança e privacidade</div>
              <div className="text-secondary" style={{ fontSize: 15 }}>Alterar senha</div>
            </div>
            <FaChevronRight className="ms-auto text-secondary" />
          </div>
          <div className="d-flex align-items-center bg-body-secondary rounded-pill p-3">
            <span className="bg-body rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 44, height: 44 }}>
              <FaTimesCircle size={20} />
            </span>
            <div>
              <div className="fw-bold">Encerrar a conta</div>
              <div className="text-secondary" style={{ fontSize: 15 }}>Encerre a sua conta pessoal.</div>
            </div>
            <FaChevronRight className="ms-auto text-secondary" />
          </div>
        </div>
      </div>

      {/* Public Profile Modal */}
      <PublicProfileModal
        show={showPublicProfileModal}
        onHide={() => setShowPublicProfileModal(false)}
        profile={profile}
        accountType={accountType}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}