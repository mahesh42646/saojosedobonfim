"use client";
import Image from "next/image";
import Link from "next/link";
import Headerpb from "./Header-pb";
import { buildApiUrl } from './config/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import styles from "./page.module.css";

export default function BrejoDoCruzPage() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);



  // Get agent profile photo based on completed type
  const getAgentProfilePhoto = (agent) => {
    if (agent.typeStatus?.personal?.isComplete && agent.profilePhotos?.personal) {
      return agent.profilePhotos.personal;
    }
    if (agent.typeStatus?.business?.isComplete && agent.profilePhotos?.business) {
      return agent.profilePhotos.business;
    }
    if (agent.typeStatus?.collective?.isComplete && agent.profilePhotos?.collective) {
      return agent.profilePhotos.collective;
    }
    return null;
  };

  // Get agent avatar color
  const getAgentColor = (agent) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = agent.fullname?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = buildApiUrl('/agent/profiles?status=active');
      const response = await fetch(url, {
        headers: {
          'Authorization': 'dummy-token-for-testing',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgents(data.profiles || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch spaces from API
  const fetchSpaces = async () => {
    try {
      setSpacesLoading(true);
      setSpacesError(null);

      const response = await fetch(buildApiUrl('/admin/spaces'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSpaces(data || []);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setSpacesError('Failed to load spaces. Please try again.');
    } finally {
      setSpacesLoading(false);
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);

      const response = await fetch(buildApiUrl('/admin/projects'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjectsError('Failed to load projects. Please try again.');
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch admin profile for banner
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(buildApiUrl('/public/admin-profile'), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdminProfile(data);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      // Don't set error state for admin profile as it's not critical
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAgents();
    fetchSpaces();
    fetchProjects();
    fetchAdminProfile();
  }, []);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <style jsx>{`
        @media (max-width: 768px) {
          .banner-text {
            left: 5% !important;
            top: 60px !important;
          }
          .banner-text .welcome {
            font-size: 16px !important;
          }
          .banner-text .title {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .banner-height {
            height: 250px !important;
          }
          .info-card {
            min-height: 200px !important;
          }
          .info-card-content {
            padding: 24px 24px !important;
            font-size: 16px !important;
          }
          .signup-card {
            width: 100% !important;
            max-width: 300px !important;
            min-height: 180px !important;
          }
          .signup-text {
            font-size: 20px !important;
          }
          .agent-grid {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .agent-row {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 20px !important;
          }
          .agent-card {
            min-width: 180px !important;
            flex-direction: column !important;
            text-align: center !important;
            gap: 8px !important;
          }
          .agent-avatar {
            width: 48px !important;
            height: 48px !important;
            font-size: 18px !important;
          }
          .agent-name {
            font-size: 14px !important;
          }
          .spaces-grid {
            justify-content: center !important;
          }
          .space-card {
            width: 100% !important;
            max-width: 300px !important;
            margin: 0 auto !important;
          }
          .project-card {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .project-content {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
          .project-image {
            width: 120px !important;
            height: 120px !important;
            align-self: center !important;
          }
          .section-title {
            font-size: 24px !important;
          }
          .spaces-title {
            font-size: 28px !important;
          }
        }
        
        @media (max-width: 480px) {
          .banner-text .title {
            font-size: 24px !important;
          }
          .banner-height {
            height: 220px !important;
          }
          .info-card-content {
            padding: 20px 20px !important;
            font-size: 15px !important;
          }
          .agent-card {
            min-width: 160px !important;
          }
          .agent-name {
            font-size: 13px !important;
          }
          .section-title {
            font-size: 20px !important;
          }
          .spaces-title {
            font-size: 24px !important;
          }
          .project-image {
            width: 100px !important;
            height: 100px !important;
          }
        }
      `}</style>

      {/* Header */}
      <Headerpb />

      {/* Banner */}
      <div className="banner-height" style={{ position: 'relative', width: '100%', height: 334, overflow: 'visible', borderBottomLeftRadius: 2, borderBottomRightRadius: 32, marginBottom: 0 }}>
        {adminProfile?.profilePhoto ? (
          <Image 
            className="img-fluid" 
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${adminProfile.profilePhoto}`} 
            alt="Banner" 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          <Image className="img-fluid" src="/images/banner-home.jpeg" alt="Banner" fill style={{ objectFit: 'cover' }} />
        )}
        {/* Green overlay gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderBottomLeftRadius: 2, borderBottomRightRadius: 32,
          background: 'linear-gradient(88.74deg, rgba(48, 194, 45, 0.87) 10%, rgba(55, 172, 55, 0) 100%)',
        }} />
        {/* Text */}
        <div className="banner-text" style={{ position: 'absolute', top: 88, left: '15%', color: '#fff', zIndex: 2 }}>
          <div className="welcome" style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>BEM VINDO AO</div>
          <div className="title" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Mapa Cultural de<br />São José do Bonfim</div>
        </div>
        {/* Bottom image border */}
        <div style={{ position: 'absolute', left: 0, bottom: -24, width: '100%', height: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden', zIndex: 3 }}>           <Image src="/images/banner_bottom.jpg" className="img-fluid" style={{ opacity: 0.9, background: 'rgba(187, 0, 0, 0)' }} alt="Banner Border" fill />         </div>
      </div>


      {/* Info and Sign Up */}
      <div className="container d-lg-flex justify-content-center gap-3 px-3 px-lg-4" style={{ marginTop: 30, marginBottom: 32 }}>
        {/* Info Card */}
        <div className="info-card" style={{
          position: 'relative',
          // width: 831,
          minHeight: 245,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Background Image */}
          <Image
            src="/images/dash-news.png"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Green Gradient Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(88.74deg, rgb(47, 127, 45) 0%, rgba(26, 139, 26, 0.15) 100%)',
          }} />
          {/* Content */}
          <div className="info-card-content" style={{
            position: 'relative',
            zIndex: 1,
            padding: '38px 38px',
            color: '#fff',
            fontSize: 20,
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            <span>
              Uma plataforma colaborativa que mapeia o cenário cultural local promovendo eventos, projetos e espaços culturais.<br />
              Além de conferir a agenda, agentes culturais podem criar perfis, divulgar iniciativas e participar de editais da Secretaria de Cultura e Turismo
            </span>
          </div>
        </div>
        {/* Sign Up Card */}
        <div className="signup-card mx-auto my-3 my-lg-0"
          onClick={() => router.push('/agent')}
          style={{
            position: 'relative',
            width: 240,
            minHeight: 220,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {/* Background Image */}
          <Image
            src="/images/dashboard-vector.png"
            alt="Map"
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Green Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(22, 51, 0, 0.8)'
          }} />
          {/* Text */}
          <span className="signup-text" style={{
            position: 'relative',
            color: '#fff',
            fontWeight: 600,
            fontSize: 24,
            zIndex: 2
          }}>Cadastre-se</span>
        </div>
      </div>

      {/* Our Agents */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 32, padding: '0 16px 0 32px' }}>
        <div className="d-flex flex-wrap" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div className="section-title" style={{ fontWeight: 600, fontSize: 20, color: '#215C2D', textAlign: 'left' }}>Nossos agentes</div>
          <Link href="/Agentes-Culturais" style={{
            textDecoration: 'none',
            color: '#215C2D',
            fontSize: 15,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            Ver todos <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading agents...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
            {error}
            <br />
            <button
              onClick={() => fetchAgents()}
              style={{
                background: '#7CFC00',
                border: 'none',
                borderRadius: 16,
                padding: '8px 16px',
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Retry
            </button>
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No agents found.
          </div>
        ) : (
          <div className="agent-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* First row */}
            <div className="agent-row" style={{ display: 'flex', justifyContent: 'center', gap: 56 }}>
              {agents.slice(0, 4).map((agent, i) => {
                const profilePhoto = getAgentProfilePhoto(agent);
                return (
                  <div key={i} className="agent-card" style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 210 }}>
                    {profilePhoto ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto}`}
                        alt={agent.fullname || 'Agent'}
                        width={64}
                        height={64}
                        className="agent-avatar"
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="agent-avatar" style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: getAgentColor(agent),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 24
                      }}>
                        {(agent.fullname || 'A').split(' ').length > 1
                          ? (agent.fullname || 'A').split(' ').map(n => n[0]).join('')
                          : (agent.fullname || 'A')[0]}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <div className="agent-name" style={{ fontWeight: 500, fontSize: 16 }}>{agent.fullname || 'Unnamed Agent'}</div>
                      <div style={{ color: '#F2994A', fontSize: 18, marginTop: 2 }}>★★★★★</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Second row */}
            <div className="agent-row" style={{ display: 'flex', justifyContent: 'center', gap: 56 }}>
              {agents.slice(4, 8).map((agent, i) => {
                const profilePhoto = getAgentProfilePhoto(agent);
                return (
                  <div key={i} className="agent-card" style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 210 }}>
                    {profilePhoto ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${profilePhoto}`}
                        alt={agent.fullname || 'Agent'}
                        width={64}
                        height={64}
                        className="agent-avatar"
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="agent-avatar" style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: getAgentColor(agent),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 24
                      }}>
                        {(agent.fullname || 'A').split(' ').length > 1
                          ? (agent.fullname || 'A').split(' ').map(n => n[0]).join('')
                          : (agent.fullname || 'A')[0]}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                      <div className="agent-name" style={{ fontWeight: 500, fontSize: 16 }}>{agent.fullname || 'Unnamed Agent'}</div>
                      <div style={{ color: '#F2994A', fontSize: 18, marginTop: 2 }}>★★★★★</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Our Spaces */}
      <div style={{ background: 'rgba(22, 51, 0, 0.08)', padding: '40px 0', marginTop: 24 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="d-flex p-4 p-lg-0 flex-wrap" style={{ gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
              <div className="spaces-title" style={{ fontWeight: 600, fontSize: 32, marginRight: 24 }}>Nossos <br /> Espaços</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #000', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-chevron-left"></i></button>
                <button style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #000', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-chevron-right"></i></button>
              </div>
              <Link href="/Espacos-Culturais" style={{
                textDecoration: 'none',
                color: '#215C2D',
                fontSize: 15,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 24
              }}>
                Ver todos <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {spacesLoading ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#666' }}>
                Loading spaces...
              </div>
            ) : spacesError ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#ff4444' }}>
                {spacesError}
                <button
                  onClick={fetchSpaces}
                  style={{
                    marginLeft: 16,
                    background: '#7CFC00',
                    border: 'none',
                    borderRadius: 16,
                    padding: '8px 16px',
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            ) : spaces.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#666' }}>
                No spaces found.
              </div>
            ) : (
              <div className="spaces-grid d-flex flex-wrap" style={{ gap: 24, overflow: 'hidden' }}>
                {spaces.slice(0, 3).map((space, i) => (
                  <div key={i} className="space-card" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: 269, padding: '5px 15px 15px 15px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: 159, position: 'relative', padding: '  10px 1px 1px 1px' }}>
                      {space.coverPhoto ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '')}/uploads/${space.coverPhoto}`}
                          alt={space.title}
                          width={100}
                          height={100}
                          style={{ borderRadius: '20px 20px 0px 0px', objectFit: 'cover', alignSelf: 'center', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '20px 20px 0px 0px',
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="bi bi-building" style={{ fontSize: 32, color: '#888' }}></i>
                        </div>
                      )}
                    </div>
                    <div className="py-3" style={{ fontWeight: 600, fontSize: 16, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {space.title}
                      {space.status === 'approved' && (
                        <span style={{ color: '#0000FF', fontSize: 16 }}>
                          <i className="bi bi-check-circle-fill"></i>
                        </span>
                      )}
                    </div>
                    {/* <div style={{ fontSize: 13, color: '#666', textAlign: 'start' }}>
                      {space.description?.length > 100
                        ? <div dangerouslySetInnerHTML={{ __html: `${space.description.substring(0, 100)}...` }} />
                        : <div dangerouslySetInnerHTML={{ __html: space.description }} />
                      }
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cultural Projects */}
      <div style={{ maxWidth: 1100, margin: '48px auto', padding: '0 16px 0 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div className="section-title" style={{ fontWeight: 600, fontSize: 32, color: '#215C2D' }}>Projetos Culturais</div>
          <Link href="/Projetos-Culturais" style={{
            textDecoration: 'none',
            color: '#215C2D',
            fontSize: 15,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            Ver todos <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {projectsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading projects...
          </div>
        ) : projectsError ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
            {projectsError}
            <button
              onClick={fetchProjects}
              style={{
                marginLeft: 16,
                background: '#7CFC00',
                border: 'none',
                borderRadius: 16,
                padding: '8px 16px',
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No projects found.
          </div>
        ) : (
          <div className="d-flex flex-column" style={{ gap: 24 }}>
            {projects.slice(0, 3).map((project, idx) => (
              <div key={idx} className="project-card d-flex flex-column flex-lg-row align-items-center justify-content-between" style={{  background: '#fff', borderRadius: 16, padding: 24, gap: 24, boxShadow: '0 0 8px 0 #0001' }}>
               
               <div className="project-content d-flex gap-4">
               {project.coverPhoto ? (
                  <Image
                    src={`https://mapacultural.saojosedobonfim.pb.gov.br/uploads/${project.coverPhoto}`}
                    alt={project.title}
                    width={150}
                    height={150}
                    className="project-image"
                    style={{ borderRadius: 16, objectFit: 'cover' }}
                  />) : (
                  <div className="project-image" style={{
                    width: 150,
                    height: 150,
                    borderRadius: 16,
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-image" style={{ fontSize: 32, color: '#888' }}></i>
                  </div>)}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{project.title}</div>
                  <div style={{ fontSize: 14, color: '#888', margin: '4px 0 8px 0' }}>
                    Tipo: {project.type}
                  </div>
                  <div style={{ fontSize: 15, color: '#222' }}>
                    {project.description?.length > 200
                      ? <div dangerouslySetInnerHTML={{ __html: `${project.description.substring(0, 200)}...` }} />
                      : <div dangerouslySetInnerHTML={{ __html: project.description }} />
                    }
                  </div>
                </div>

               </div>

                <Link className="d-flex gap-2"
                  href={`/public/projetos?id=${project._id}`}
                  style={{
                    background: '#2CB34A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    alignSelf: 'center',
                    boxShadow: '0 2px 8px #2CB34A44',
                    textDecoration: 'none'
                  }}
                >
                 
                  Conhecer
                  <i className="bi bi-arrow-right fw-bold"></i>
                </Link>
              </div>

            ))}

          </div>
        )}
      </div>
    </div>
  );
}
