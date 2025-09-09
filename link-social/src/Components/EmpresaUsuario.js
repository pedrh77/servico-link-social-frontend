import React, { useState, useEffect } from "react";
import AccordionSection from "./AccordionSection";
import Header from "./Header.js";
import TransacaoCard from "./TransacaoCard.js";
import { GetTransacoesRecebidasByEmpresaId } from "../Api.js";

export default function EmpresaUsuario({ dados }) {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    async function carregarTransacoesEmpresa() {
      if (dados?.id) {
        const lista = await GetTransacoesRecebidasByEmpresaId(dados.id);
        setTransacoes(lista || []);
      }
    }
    carregarTransacoesEmpresa();
  }, [dados?.id]);

  return (
    <>
      <Header />
      <AccordionSection title="Transações da Empresa">
        {transacoes.length === 0 ? (
          <p>Não recebemos uma transação ainda...</p>
        ) : (
           <ul className="lista-transacao">
            <li className="lista-header">
              <span>Doador</span>
              <span>Valor</span>
              <span>Tipo</span>
              <span>Status</span>
              <span>Comentário</span>
            </li>
            {transacoes.map((t) => (
              <TransacaoCard key={t.id} transacao={t} />
            ))}
          </ul>
        )}
      </AccordionSection>
    </>
  );
}
