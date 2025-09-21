import React, { useState, useEffect } from "react";
import AccordionSection from "../../Components/AccordionSection.js";
import Header from "../../Components/Header.js";
import { GetTransacoesRecebidasByEmpresaId } from "../../Api.js";

export default function EmpresaUsuario({ dados }) {
  const [filtroDoador, setFiltroDoador] = useState("");
  const [filtroIdentificador, setFiltroIdentificador] = useState("");
  const [mostrarCodigo, setMostrarCodigo] = useState({});

  const [transacoesPendentes, setTransacoesPendentes] = useState([]);
  const [transacoesAprovadas, setTransacoesAprovadas] = useState([]);

  useEffect(() => {
    async function carregarTransacoesEmpresa() {
      if (dados?.id) {
        const pendentes = await GetTransacoesRecebidasByEmpresaId(dados.id, '0');
        const aprovadas = await GetTransacoesRecebidasByEmpresaId(dados.id, 1);

        setTransacoesPendentes(pendentes || []);
        setTransacoesAprovadas(aprovadas || []);
      }
    }
    carregarTransacoesEmpresa();
  }, [dados?.id]);

  const alternarCodigo = (id) => {
    setMostrarCodigo((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Função para filtrar transações pendentes
  const filtrarTransacoes = (lista) => {
    return lista.filter(
      (t) =>
        t.nomeDoador.toLowerCase().includes(filtroDoador.toLowerCase()) &&
        t.nomeTransacao.toLowerCase().includes(filtroIdentificador.toLowerCase())
    );
  };

  return (
    <>
      <Header />

      <AccordionSection title="Transações Pendentes de Aprovação">
        <div className="filtro-container">
          <input
            type="text"
            placeholder="Buscar por doador..."
            value={filtroDoador}
            onChange={(e) => setFiltroDoador(e.target.value)}
            className="filtro-input"
          />
          <input
            type="text"
            placeholder="Buscar por identificador..."
            value={filtroIdentificador}
            onChange={(e) => setFiltroIdentificador(e.target.value)}
            className="filtro-input"
          />
        </div>

        {filtrarTransacoes(transacoesPendentes).length === 0 ? (
          <p>Nenhuma transação pendente encontrada...</p>
        ) : (
          <ul className="lista-transacao">
            <li className="lista-header">
              <span>Cliente</span>
              <span>Identificador</span>
              <span>Valor</span>
              <span>Status</span>
              <span>Código</span>
            </li>
            {filtrarTransacoes(transacoesPendentes).map((t) => (
              <li key={t.transacaoId} className="lista-item">
                <span>{t.nomeDoador}</span>
                <span>{t.nomeTransacao}</span>
                <span>
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span>{t.status}</span>
                <span>
                  {mostrarCodigo[t.transacaoId] ? (
                    t.codigo
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
              <span>Data</span>
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
                <span>Aprovado</span>
                <span>
                  {new Date(t.dataCriacao).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>
    </>
  );
}
