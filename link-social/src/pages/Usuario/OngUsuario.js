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

  const links = [{ label: "Início", path: "/Home" }];

  if (!doacoes || doacoes.length === 0)
    return <p>Nenhuma doação registrada.</p>;

  const totalArrecadado = doacoes.reduce((soma, d) => soma + d.valor, 0);
  const doadoresUnicos = new Set(doacoes.map(d => d.doadorId)).size;
  const media = (totalArrecadado / doacoes.length).toFixed(2);
  const anonimas = doacoes.filter(d => d.anonima).length;

  const tipoResumo = doacoes.reduce(
    (acc, d) => {
      if (d.tipoDoacao === 1) acc.avulsa += d.valor;
      else if (d.tipoDoacao === 2) acc.recorrente += d.valor;
      else if (d.tipoDoacao === 0) acc.parcela += d.valor;
      return acc;
    },
    { avulsa: 0, recorrente: 0, parcela: 0 }
  );

  return (
    <>
      <Header links={links} />

      <AccordionSection title="Doações Recebidas">
        <DoacaoLista doacoes={doacoes} tipoUsuario="ong" />
      </AccordionSection>

      <AccordionSection title="Relatório de Doações">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <h4>Total arrecadado</h4>
            <p>R$ {totalArrecadado}</p>
          </div>
          <div style={cardStyle}>
            <h4>Doadores únicos</h4>
            <p>{doadoresUnicos}</p>
          </div>
          <div style={cardStyle}>
            <h4>Média por doação</h4>
            <p>R$ {media}</p>
          </div>
          <div style={cardStyle}>
            <h4>Doações anônimas</h4>
            <p>{anonimas}</p>
          </div>
        </div>

        <h4 style={{ marginTop: "1rem" }}>Resumo por tipo de doação</h4>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={cardTypeStyle("lightgreen")}>
            Avulsa: R$ {tipoResumo.avulsa}
          </div>
          <div style={cardTypeStyle("lightblue")}>
            Recorrente: R$ {tipoResumo.recorrente}
          </div>
          <div style={cardTypeStyle("lightcoral")}>
            Parcelas: R$ {tipoResumo.parcela}
          </div>
        </div>
      </AccordionSection>
    </>
  );
}

const cardStyle = {
  background: "#f5f5f5",
  padding: "1rem",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  marginTop: "20px"
};

const cardTypeStyle = (bgColor) => ({
  background: bgColor,
  padding: "0.8rem",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center",
  color: "#000",
  fontWeight: "bold",
  marginBottom: "20px",
  gap:"70px"

});