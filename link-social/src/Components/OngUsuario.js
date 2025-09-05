import React, { useState, useEffect } from "react";
import { GetDoacoesByOngId } from "../Api.js";
import AccordionSection from "./AccordionSection";
import CardDoacao from "./DoacaoCard.js";

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

  return (
    <AccordionSection title="Doações Recebidas">
      {doacoes.length === 0 ? <p>Sua ONG ainda não recebeu doações.</p> :
        <ul>{doacoes.map((d) => <CardDoacao key={d.id} doacao={d} />)}</ul>}
    </AccordionSection>
  );
}
