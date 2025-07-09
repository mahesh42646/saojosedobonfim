"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EditProfile from './editprofile';
import { useAuth } from '../authContex';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/painel');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/unified/profile`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  if (showEditProfile) {
    return <EditProfile adminData={userData} onBack={() => setShowEditProfile(false)} />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-5 py-lg-5 ">
          <div className="bg-light rounded-4 my-1 p-4" style={{ background: '#F5FFF0', width:"404px", height:"303px" }}>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                {userData?.profilePhoto && userData.profilePhoto.trim() ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${userData.profilePhoto.trim()}`}
                    alt="Perfil"
                    width={100}
                    height={100}
                    className="rounded-circle border"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src="/images/placeholder-Avatar.png"
                    alt="Perfil Padrão"
                    width={100}
                    height={100}
                    className="rounded-circle border"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <h2 className="py-4 my-2" style={{ fontSize: '24px', fontWeight: '600' }}>
                {userData?.role === 'staff' ? userData?.fullName : userData?.name || 'Carregando...'}
              </h2>
              {(userData?.title || userData?.employeeType) && (
                <p className="text-muted mb-2">{userData?.role === 'staff' ? userData?.employeeType : userData?.title}</p>
              )}
              {userData?.description && (
                <p className="text-muted small">{userData.description}</p>
              )}
            </div>
          </div>
          <div className="d-flex py-2 justify-content-center align-items-center">
            <button 
              className="btn" 
              onClick={handleLogout}
              style={{ 
                background: '#F8F9FA',
                border: '1px solid #F5FFF0',
                borderRadius: '50px',
                padding: '8px 24px',
                color: '#212529'
              }}
            >
              Sair
            </button>
          </div>
        </div>
        

        {/* Right Section */}
        <div className="col-md-7">
          <h1 className="mb-3" style={{ fontSize: '32px', fontWeight: '700' }}>Configurações</h1>
          
          {/* Settings Options */}
          <div>
            {/* Public Profile Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setShowEditProfile(true)}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-arrow-left-right fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Perfil Público</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Atualize seus dados públicos.</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>

            {/* Security Option */}
            <div 
              className="rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                background: '#F8F9FA',
                padding: '24px',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-center">
                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: '#fff',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className="bi bi-shield fs-5"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Segurança e privacidade</h3>
                  <p style={{ fontSize: '14px', color: '#6C757D', margin: 0 }}>Alterar email e senha</p>
                </div>
              </div>
              <i className="bi bi-chevron-right fs-5" style={{ color: '#6C757D' }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 