import React, { useState, useEffect } from "react";
import { GetDoacoesByOngId } from "../../Api";
import "./UsuarioOng.css";

export default function OngUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [expanded, setExpanded] = useState({}); // track which items are expanded

  useEffect(() => {
    async function carregarDoacoes() {
      if (dados?.id) {
        const lista = await GetDoacoesByOngId(dados.id);
        setDoacoes(lista);
      }
    }
    carregarDoacoes();
  }, [dados?.id]);

  const tipoDoacaoTexto = (tipo) =>
    ({ 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" }[tipo] || "Desconhecido");

  const statusTexto = (status) => {
    return { 0: "Pendente", 1: "Pago", 2: "Cancelado" }[status] ?? "Desconhecido";
  };

  const statusClasse = (status) => {
    return { 0: "status-pendente", 1: "status-pago", 2: "status-cancelado" }[status] ?? "";
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="accordion-section">
      <button className="accordion-header" type="button" aria-expanded={true}>
        Doações Recebidas
      </button>
      <div className="lista-doacoes-container">
        {doacoes.length === 0 ? (
          <p>Sua ONG ainda não recebeu doações.</p>
        ) : (
          <ul className="lista-doacoes-compacta">
            {doacoes.map((d) => (
              <li key={d.id} className={`card-doacao ong ${expanded[d.id] ? "expanded" : ""}`}>
                <div className="doacao-summary" onClick={() => toggleExpand(d.id)}>
                  <p><strong>Doador:</strong> {d.nomeDoador ?? "Anônimo"}</p>
                  <p><strong>Valor:</strong> R$ {(d.valor ?? 0).toFixed(2)}</p>
                  <p className={statusClasse(d.statusPagamento)}>
                    <strong>Status:</strong> {statusTexto(d.statusPagamento)}
                  </p>
                  <span className="expand-icon">{expanded[d.id] ? "▲" : "▼"}</span>
                </div>
                {expanded[d.id] && (
                  <div className="doacao-detalhes">
                    <p><strong>Benefício:</strong> {d.descricaoBeneficio ?? "-"}</p>
                    <p><strong>Tipo:</strong> {tipoDoacaoTexto(d.tipoDoacao)}</p>
                    {d.comentario && d.comentario.trim() !== "" && (
                      <div className="comentario">
                        <strong>Comentário:</strong> {d.comentario}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
