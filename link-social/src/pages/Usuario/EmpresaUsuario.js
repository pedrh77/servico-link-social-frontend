import React, { useState, useEffect } from "react";
import AccordionSection from "../../Components/AccordionSection.js";
import Header from "../../Components/Header.js";
import { GetTransacoesRecebidasByEmpresaId } from "../../Api.js";

export default function EmpresaUsuario({ dados }) {
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarCodigo, setMostrarCodigo] = useState({}); 

  useEffect(() => {
    async function carregarTransacoesEmpresa() {
      if (dados?.id) {
        const lista = await GetTransacoesRecebidasByEmpresaId(dados.id, 1);
        setTransacoes(lista || []);
      }
    }
    carregarTransacoesEmpresa();
  }, [dados?.id]);

  const transacoesFiltradas = transacoes.filter((t) =>
    t.nomeDoador?.toLowerCase().includes(filtro.toLowerCase())
  );

  const transacoesAprovadas = transacoesFiltradas.filter((t) => t.status === "Aprovado");
  const transacoesPendentes = transacoesFiltradas.filter((t) => t.status !== "Aprovado");

  const alternarCodigo = (id) => {
    setMostrarCodigo((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Header />

      <AccordionSection title="Transações Pendentes de Aprovação">
        <div className="filtro-container">
          <input
            type="text"
            placeholder="Buscar por doador..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>

        {transacoesPendentes.length === 0 ? (
          <p>Nenhuma transação pendente encontrada...</p>
        ) : (
          <ul className="lista-transacao">
            <li className="lista-header">
              <span>Cliente</span>
              <span>Valor</span>
              <span>Status</span>
              <span>Código</span>
            </li>
            {transacoesPendentes.map((t) => (
              <li key={t.transacaoId} className="lista-item">
                <span>{t.nomeDoador}</span>
                <span>
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span>{t.status}</span>
                <span>
                  {mostrarCodigo[t.transacaoId] ? (
                    <>{t.codigo}</>
                  ) : (
                    <button
                      onClick={() => alternarCodigo(t.transacaoId)}
                      className="botao-codigo"
                    >
                      Mostrar
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>

      <AccordionSection title="Transações Aprovadas">
        {transacoesAprovadas.length === 0 ? (
          <p>Nenhuma transação aprovada ainda.</p>
        ) : (
          <ul className="lista-transacao">
            <li className="lista-header">
              <span>Cliente</span>
              <span>Valor</span>
              <span>Status</span>
              <span>Código</span>
            </li>
            {transacoesAprovadas.map((t) => (
              <li key={t.transacaoId} className="lista-item">
                <span>{t.nomeDoador}</span>
                <span>
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span>{t.status}</span>
                <span>
                  {mostrarCodigo[t.transacaoId] ? (
                    <>{t.codigo}</>
                  ) : (
                    <button
                      onClick={() => alternarCodigo(t.transacaoId)}
                      className="botao-codigo"
                    >
                      Mostrar
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>
    </>
  );
}
