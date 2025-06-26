"use client";
import React, { useState } from "react";
import Image from 'next/image';
// import 'leaflet/dist/leaflet.css';

const spaces = [

  { name: "Espac 3", subtitle: "Prefeitura Municipal", color: "#3B5998", type: "CENTRO", status: "approved" },
];

function SpaceDetails({ space, onBack }) {
  const [tab, setTab] = useState("update");
  return (
    <div className="ps-2">

      <h4 className=" mt-3  fw-bold">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 36 }}>←</button>
        Cultural Space Details</h4>

      <div style={{ maxWidth: 874, margin: '0 auto', background: '#fff', borderRadius: 16, border: '2px solid #eee', padding: 0 }}>
        <div style={{ backgroundColor: '#f7f7f7', padding: 14, borderBottom: '1px solid #eee', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: space.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 32 }}><i className="bi bi-building"></i></span>
            </div>
            <div >
              <div style={{ fontWeight: 600, fontSize: 20 }}>{space.name || 'Pedra da Turmalina'}</div>
              <div style={{ color: '#222', fontSize: 15, fontWeight: 500 }}>TIPO: {space.type || 'PARQUE'}</div>
              <div style={{ fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ color: '#2F5711', fontSize: 18 }}><i class="bi bi-check-circle-fill"></i></span> Espaço aprovado e publicado
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingLeft: 24, gap: 32, marginTop: 0 }}>
          <div onClick={() => setTab('update')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'update' ? '2px solid #2F5711' : 'none', color: tab === 'update' ? '#2F5711' : '#222', fontWeight: tab === 'update' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Update
          </div>
          <div onClick={() => setTab('details')} style={{ cursor: 'pointer', padding: '18px 0 10px 0', borderBottom: tab === 'details' ? '2px solid #2F5711' : 'none', color: tab === 'details' ? '#2F5711' : '#222', fontWeight: tab === 'details' ? 600 : 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Details
          </div>
        </div>
        {/* Timeline/History */}
        {tab === 'update' && (
          <div style={{ padding: 32, paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 24 }}>
              <div style={{ minWidth: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#2ecc40', fontSize: 22 }}>✔</span>
                <span style={{ color: '#2ecc40', fontSize: 22 }}>✔</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: '#888', fontSize: 15 }}>segunda-feira, 5 de maio 21:51</div>
                  <div style={{ color: '#222', fontSize: 15 }}>Space created successfully</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: 15 }}>sexta-feira, 9 de maio 10:01</div>
                  <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>Space approved and published</div>
                </div>
              </div>
              <div style={{ minWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <input value="Space approved and published" readOnly style={{ width: '100%', padding: 12, borderRadius: 24, border: '2px solid #eee', fontSize: 15 }} />
              </div>
            </div>
          </div>
        )}
        {tab === 'details' && (
          <form style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: '#fff' }}>
            {/* Project type */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Project type *</label>
              <select style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                <option>Select</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </select>
            </div>
            {/* Project name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Project name *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F2F5F2', borderRadius: 8, padding: '8px 12px', gap: 8 }}>
                <span style={{ color: '#2F5711', fontSize: 20 }}><i className="bi bi-card-text"></i></span>
                <span style={{ fontWeight: 500 }}>Description *</span>
              </div>
              <textarea style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 80, background: '#F7F7F7' }} defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged." />
            </div>
            {/* Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Capacity of people in space *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Opening and closing hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Opening and closing hours *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Operating days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Operating days *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Project links */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-facebook"></i></span>
                <span style={{ fontWeight: 600 }}>Facebook</span>
                <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#2F5711', width: 18, height: 18 }} />
                </label>
              </div>
              <input value="https://www.facebook.com/mapaculturalnav/" readOnly style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }} />
            </div>
            {/* Physical Accessibility */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>Physical Accessibility</span>
                <span style={{ marginLeft: 'auto', color: '#2F5711', fontSize: 18 }}><i className="bi bi-chevron-down"></i></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <label><input type="checkbox" /> Banheiros adaptados</label>
                <label><input type="checkbox" /> Rampa de acesso</label>
                <label><input type="checkbox" /> Elevador</label>
                <label><input type="checkbox" /> Sinalização tátil</label>
                <label><input type="checkbox" /> Bebedouro adaptado</label>
                <label><input type="checkbox" /> Corrimão nas escadas e rampas</label>
                <label><input type="checkbox" /> Elevador adaptado</label>
              </div>
            </div>
            {/* Photo gallery */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Photo gallery</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 160, height: 170, background: '#FF0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image 
                    src="/images/card.png" 
                    alt="gallery" 
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 6, right: 8, color: '#2F5711', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-x-circle-fill"></i></span>
                </div>
                <div style={{ width: 160, height: 170, background: '#FF0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image 
                    src="/images/card.png" 
                    alt="gallery" 
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 6, right: 8, color: '#2F5711', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-x-circle-fill"></i></span>
                </div>
              </div>
            </div>
            {/* Map section */}
            <section style={{
              background: "#fff",
              color: "#111",
              borderRadius: 10,
              margin: "",
              maxWidth: 1499,
              padding: 0,
              marginBottom: 0
            }}>
              <div style={{ padding: "0 0px" }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <i className="bi bi-geo-alt" style={{ color: '#222', fontSize: 18 }}></i>
                  <span style={{ fontSize: 15 }}>Brejo do Cruz/PB - 58890-000</span>
                </div>
                <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                  <iframe
                    title="Pedra da Turmalina Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-37.507%2C-6.350%2C-37.497%2C-6.340&amp;layer=mapnik"
                    style={{ width: '100%', height: 300, border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
              <div style={{ textAlign: "left", margin: "20px 0 30px 30px", fontSize: 14 }}>
                This is the public page of the Cultural Space, which can be accessed by anyone. Example of a link in the system <br />
                <a href="(https://mapadacultura.com/brejodocruz-pb/espacosculturais/999)" style={{ color: "#4af", textDecoration: "underline" }}>
                  (https://mapadacultura.com/brejodocruz-pb/espacosculturais/999)
                </a>
              </div>
            </section>
          </form>
        )}
        {/* Action Buttons */}

      </div>
      <div className='me-5' style={{ display: 'flex', justifyContent: 'end', gap: 24, padding: 24, background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <button style={{ background: '#F7f7f7', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Inactive</button>
        <button style={{ background: '#F7f7f7', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Reject</button>
        <button style={{ background: '#7CFC00', color: '#000', border: 'none', borderRadius: 24, padding: '6px 48px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Approve</button>
      </div>
    </div>
  );
}

export default function CspacePage() {
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  
  // Full-page Create Space form (matches uploaded design)
  function CreateSpaceForm() {
    return (
      <div style={{ height: '100vh', background: '#fff', width: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, overflowY: 'auto', padding: '0' }}>
        {/* Header */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 0 32px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image src="/images/MadminLogo.jpg" alt="Logo" width={40} height={40} style={{ height: 40 }} />
            <button onClick={() => setShowCreate(false)} style={{ background: '#F2F5F2', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: 22, color: '#222' }}>&larr;</span>
            </button>
          </div>
          <Image src="/images/crest.png" alt="Crest" width={40} height={40} style={{ height: 40 }} />
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', padding: '32px 16px' }}>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 24 }}>Create new cultural space</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Project type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Project type *</label>
              <select style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}>
                <option>Select</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </select>
            </div>
            {/* Project name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Project name *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F2F5F2', borderRadius: 8, padding: '8px 12px', gap: 8 }}>
                <span style={{ color: '#2F5711', fontSize: 20 }}><i className="bi bi-card-text"></i></span>
                <span style={{ fontWeight: 500 }}>Description *</span>
              </div>
              <textarea style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 80, background: '#F7F7F7' }} defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrystandard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged." />
            </div>
            {/* Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Capacity of people in space *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Opening and closing hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Opening and closing hours *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Operating days */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Operating days *</label>
              <input style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
            </div>
            {/* Cover */}
            <div style={{ background: '#E6EFE6', borderRadius: 12, padding: 16, marginBottom: 0 }}>
              <div style={{ border: '2px dashed #B5CDB5', borderRadius: 12, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#2F5711', fontWeight: 600, fontSize: 22, cursor: 'pointer' }}>
                <span style={{ fontSize: 32, marginBottom: 8 }}>+</span>
                Novo
              </div>
            </div>
            {/* Project links */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Project links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-instagram"></i></span>
                  <span>Instagram</span>
                  <label style={{ marginLeft: 'auto' }}><input type="checkbox" style={{ accentColor: '#2F5711', width: 18, height: 18 }} /></label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-youtube"></i></span>
                  <span>Youtube</span>
                  <label style={{ marginLeft: 'auto' }}><input type="checkbox" style={{ accentColor: '#2F5711', width: 18, height: 18 }} /></label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#2F5711', fontSize: 22 }}><i className="bi bi-facebook"></i></span>
                  <span>Facebook</span>
                  <label style={{ marginLeft: 'auto' }}><input type="checkbox" defaultChecked style={{ accentColor: '#2F5711', width: 18, height: 18 }} /></label>
                </div>
                <input value="https://www.facebook.com/mapaculturalnav/" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15, background: '#fff' }} />
              </div>
            </div>
            {/* Physical Accessibility */}
            <div style={{ background: '#F2F5F2', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>Physical Accessibility</span>
                <span style={{ marginLeft: 'auto', color: '#2F5711', fontSize: 18 }}><i className="bi bi-chevron-down"></i></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <label><input type="checkbox" /> Banheiros adaptados</label>
                <label><input type="checkbox" /> Rampa de acesso</label>
                <label><input type="checkbox" /> Elevador</label>
                <label><input type="checkbox" /> Sinalização tátil</label>
                <label><input type="checkbox" /> Bebedouro adaptado</label>
                <label><input type="checkbox" /> Corrimão nas escadas e rampas</label>
                <label><input type="checkbox" /> Elevador adaptado</label>
              </div>
            </div>
            {/* Photo gallery */}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Photo gallery</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 120, height: 120, background: '#FF0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image 
                    src="/images/card.png" 
                    alt="gallery" 
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 6, right: 8, color: '#2F5711', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-x-circle-fill"></i></span>
                </div>
                <div style={{ width: 120, height: 120, background: '#FF0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Image 
                    src="/images/card.png" 
                    alt="gallery" 
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 6, right: 8, color: '#2F5711', fontSize: 18, cursor: 'pointer' }}><i className="bi bi-x-circle-fill"></i></span>
                </div>
                <div style={{ width: 120, height: 120, background: '#E6EFE6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F5711', fontWeight: 600, fontSize: 22, cursor: 'pointer' }}>
                  + Novo
                </div>
              </div>
            </div>
            {/* Map section */}
            <section style={{
              background: "#fff",
              color: "#111",
              borderRadius: 10,
              margin: "",
              maxWidth: 1499,
              padding: 0,
              marginBottom: 0
            }}>
              <div style={{ padding: "0 0px" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <i className="bi bi-geo-alt" style={{ color: '#222', fontSize: 18 }}></i>
                  <span style={{ fontSize: 15 }}>Brejo do Cruz/PB - CEP - 58890000</span>
                </div>
                <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                  <iframe
                    title="Pedra da Turmalina Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-37.507%2C-6.350%2C-37.497%2C-6.340&amp;layer=mapnik"
                    style={{ width: '100%', height: 200, border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </section>
            <button type="submit" style={{ background: '#7CFC00', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 0', fontWeight: 600, fontSize: 18, marginTop: 24, width: '100%' }}>Create Space</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-2" >
      {showCreate ? (
        <CreateSpaceForm />
      ) : selectedSpace ? (
        <SpaceDetails space={selectedSpace} onBack={() => setSelectedSpace(null)} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>List of Cultural Spaces</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Search space"
                style={{ border: '1px solid #ccc', borderRadius: 24, padding: '6px 24px', outline: 'none', width: 200 }}
              />
              <button onClick={() => setShowCreate(true)} style={{ background: '#7CFC00', border: 'none', borderRadius: 24, padding: '8px 24px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                New Culture
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {spaces.map((space, idx) => (
              <div
                key={space.name + idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'transparent',
                  borderRadius: 20,
                  padding: '0px',
                  minHeight: 48,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedSpace(space)}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: space.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 22 }}><i className="bi bi-building"></i></span>
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 16 }}>{space.name}</div>
                  <div style={{ color: '#888', fontSize: 15 }}>{space.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
