// "use client";
// import React from 'react';

// const AdminDashboardPage = () => {
//   return (
//     <div className=" ">
//       <div className="container py-3">
//         <div className="row">
//           <div className="col-12 col-md-9 col-lg-9">
//             <h4 className="text-dark my-">Dashboard</h4>
//             <div className="d-flex flex-row align-items-start gap-4">
//               {/* Profile Card */}
//               <div
//                 className="d-flex flex-column align-items-center"
//                 style={{
//                   backgroundColor: '#BEDC74',
//                   borderRadius: '32px',
//                   minWidth: 320,
//                   minHeight: 400,
//                   padding: '10px 16px 0px 16px',
//                   position: 'relative',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
//                 }}
//               >
//                 <div
//                   className=""
//                   style={{
//                     color: '#1B4D1A',
//                     fontSize: 20,
//                     marginBottom: 0,
//                     marginTop: 8,
//                     textAlign: 'center'
//                   }}
//                 >
//                   Active Tenants
//                 </div>
//                 <div
//                   className="fw-bold"
//                   style={{
//                     color: 'white',
//                     fontSize: 56,
//                     lineHeight: 1,
//                     marginTop: 8,
//                     marginBottom: -60,
//                     zIndex: 2,
//                     position: 'relative'
//                   }}
//                 >
//                   1
//                 </div>
//                 <Image
//                   src="/images/img.png"
//                   alt="Profile"
//                   style={{
//                     width: 275,
//                     height: 378,
//                     objectFit: 'cover',
//                     marginTop: -10,
//                     zIndex: 1,
//                     position: 'relative'
//                   }}
//                 />
//               </div>
//               {/* Stats Cards */}
//               <div className="col-12 col-lg-10">
//                 <div className="d-flex flex-column gap-4 h-100">
//                   <div className="d-flex gap-4 flex-wrap">
//                     <div className="bg-white rounded-5 border p-4 d-flex flex-column align-items-start justify-content-center flex-fill" style={{ minWidth: 200, minHeight: 110 }}>
//                       <div className="text-secondary" style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>MRR</div>
//                       <div className="fw-semibold" style={{ fontSize: 38, color: '#333' }}>$5</div>
//                     </div>
//                     <div className="bg-white rounded-5 border p-4 d-flex flex-column align-items-start justify-content-center flex-fill" style={{ minWidth: 200, minHeight: 110 }}>
//                       <div className="text-secondary" style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>ARR</div>
//                       <div className="fw-semibold" style={{ fontSize: 38, color: '#4CAF50' }}>$60</div>
//                     </div>
//                   </div>
//                   <div className="bg-white rounded-5 border p-4 text-secondary d-flex align-items-center justify-content-center flex-fill" style={{ fontSize: 18, minHeight: 90, fontWeight: 500 }}>
//                     <span>View more in reports</span>
//                     <span className="ms-2" style={{ fontSize: 22, fontWeight: 400, display: 'inline-block', marginTop: 2 }}>&#8594;</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage; 