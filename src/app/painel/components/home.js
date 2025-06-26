import React from "react";
import Image from "next/image";

const cards = [
  {
    title: "Agendar a sua transferência",
    img: "/images/card.png",
  },
  {
    title: "Autorize débitos automáticos",
    img: "/images/card.png",
  },
  {
    title: "Conversão automática",
    img: "/images/card.png",
  },
  {
    title: "Conversão automática",
    img: "/images/card.png",
  },
];

export default function HomePage() {
  return (
    <div className="ps-lg-5 pe-lg-2 px-2 py-lg-4 py-3 mt-lg-2" >
      <div className="d-flex justify-content-between align-items-center ">
       
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22 }}>Latest Projects and Spaces</h2>
        <button className="btn p-0 border-bottom border-dark border-end-0 border-top-0 border-start-0 rounded-0 " style={{ color: 'rgba(22, 51, 0, 1)', }}>Ver todas</button>
      </div>
      <div className="d-flex flex-column flex-lg-row col-12 py-4  pe-lg-5 gap-3">
        {cards.map((card, idx) => ( 
          <div key={idx} className=" p-4 col-12 col-lg-3 d-flex flex-column align-items-center rounded-4 "
            style={{ background: '#ffff3c', }}>
            <div className="text-start fw-semibold w-75 fs-18 text-dark">{card.title}</div>
            <Image src={card.img} alt="icon" width={144} height={144} />
          </div>
        ))}
      </div>
    </div>
  );
}
