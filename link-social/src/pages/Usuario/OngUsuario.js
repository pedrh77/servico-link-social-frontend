import React, { useState, useEffect } from "react";
import { GetDoacoesByOngId } from "../../Api.js";
import Header from "../../Components/Header.js";
import AccordionSection from "../../Components/AccordionSection.js";
import DoacaoLista from "../../Components/DoacaoCardList.js";

export default function OngUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    async function carregarDoacoes() {
      if (dados?.id) {
        const lista = await GetDoacoesByOngId(dados.id);
        setDoacoes(lista);
      }
    }
    carregarDoacoes();
  }, [dados?.id]);

  const links = [
    { label: "Inicio", path: "/Home" }
  ];

  return (
    <>
      <Header links={links} />

      <AccordionSection title="Doações Recebidas">
        {doacoes.length === 0 ? (
          <p>Sua ONG ainda não recebeu doações.</p>
        ) : (
          console.log(doacoes, "doacoes"),
             <DoacaoLista doacoes={doacoes} tipoUsuario='ong' />

        )}
      </AccordionSection>
    </>
  );

}
