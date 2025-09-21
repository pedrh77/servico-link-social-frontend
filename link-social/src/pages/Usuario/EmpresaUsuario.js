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
    setMostrarCodigo((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtrarTransacoes = (lista) => {
    return lista.filter(
      (t) =>
        t.nomeDoador.toLowerCase().includes(filtroDoador.toLowerCase()) &&
        t.nomeTransacao.toLowerCase().includes(filtroIdentificador.toLowerCase())
    );
  };

  // --- Métricas ---
  const totalRecebido = transacoesAprovadas.reduce((s, t) => s + t.valor, 0);
  const totalPendentes = transacoesPendentes.reduce((s, t) => s + t.valor, 0);
  const clientesUnicos = new Set(transacoesAprovadas.map(t => t.nomeDoador)).size;

  // Média de tempo entre criação e aprovação (em dias)
  const mediasDias = transacoesAprovadas
    .filter(t => t.dataAprovacao)
    .map(t => (new Date(t.dataAprovacao) - new Date(t.dataCriacao)) / (1000*60*60*24));
  const mediaAprovacao = mediasDias.length ? (mediasDias.reduce((a,b)=>a+b,0)/mediasDias.length).toFixed(1) : 0;

  // Top 3 clientes que mais pagaram
  const topClientesObj = transacoesAprovadas.reduce((acc, t) => {
    acc[t.nomeDoador] = (acc[t.nomeDoador] || 0) + t.valor;
    return acc;
  }, {});
  const top3Clientes = Object.entries(topClientesObj)
    .sort((a,b) => b[1]-a[1])
    .slice(0,3);

  // Transações pendentes antigas (mais de 7 dias)
  const hoje = new Date();
  const pendentesAntigas = transacoesPendentes.filter(t => {
    const dataCriacao = new Date(t.dataCriacao);
    const diffDias = (hoje - dataCriacao)/(1000*60*60*24);
    return diffDias > 7;
  });

  return (
    <>
      <Header />

      <AccordionSection title="Resumo de Transações">
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center", // centraliza horizontalmente
      alignItems: "center",     // centraliza verticalmente
      gap: "1rem",
      marginBottom: "1rem"      // dá um espacinho embaixo
    }}
  >
    <Card title="Total Recebido" valor={`R$ ${totalRecebido}`} cor="#4caf50" />
    <Card title="Total a Receber" valor={`R$ ${totalPendentes}`} cor="#ff9800" />
    <Card title="Clientes Únicos" valor={clientesUnicos} cor="#2196f3" />
  </div>

  <h4 style={{ textAlign: "center", marginTop: "1rem" }}>Top 3 Clientes que mais pagaram</h4>
  <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
    {top3Clientes.map(([nome, valor]) => (
      <li key={nome} style={{ marginBottom: "4px" }}>
        {nome}: R$ {valor.toLocaleString("pt-BR")}
      </li>
    ))}
  </ul>

  <h4
    style={{
      textAlign: "center",
      marginTop: "1rem",
      color: pendentesAntigas.length ? "red" : "black"
    }}
  >
    Transações Pendentes Antigas ({pendentesAntigas.length})
  </h4>
  <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
    {pendentesAntigas.map(t => (
      <li key={t.transacaoId} style={{ marginBottom: "4px" }}>
        {t.nomeDoador} - {t.nomeTransacao} - R$ {t.valor.toLocaleString("pt-BR")}
      </li>
    ))}
  </ul>
</AccordionSection>


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
                  {t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <span>{t.status}</span>
                <span>
                  {mostrarCodigo[t.transacaoId] ? (
                    t.codigo
                  ) : (
                    <button onClick={() => alternarCodigo(t.transacaoId)} className="botao-codigo">
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
                  {t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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

function Card({ title, valor, cor }) {
  return (
    <div
      style={{
        background: cor,
        padding: "1rem",
        borderRadius: "8px",
        minWidth: "150px",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        margin:"20px 0"
      }}
    >
      <div>{title}</div>
      <div style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>{valor}</div>
    </div>
  );
}