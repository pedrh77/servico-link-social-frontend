import React, { useState } from "react";
import "./DoacaoCard.css";

export default function CardDoacao({ doacao }) {
  const [expanded, setExpanded] = useState(false);
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(doacao.valor);
  const [comentario, setComentario] = useState(doacao.comentario || "");

  const toggleExpand = () => setExpanded(!expanded);
  const salvarEdicao = () => {
    // Salvar na API
    setEditando(false);
  };

  const statusClasse = (status) =>
    ({ 0: "status-pendente", 1: "status-pago", 2: "status-cancelado" }[status] || "");

  return (
    <li className={`card-doacao ${expanded ? "expanded" : ""}`}>
      <div className="doacao-summary" onClick={toggleExpand}>
        <p><strong>Doador:</strong> {doacao.nomeDoador ?? "Anônimo"}</p>
        <p><strong>Valor:</strong> R$ {valor.toFixed(2)}</p>
        <p className={statusClasse(doacao.statusPagamento)}>
          <strong>Status:</strong> {doacao.statusPagamentoTexto}
        </p>
        <span className="expand-icon">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="doacao-detalhes">
          <p><strong>Benefício:</strong> {doacao.descricaoBeneficio ?? "-"}</p>
          <p><strong>Tipo:</strong> {doacao.tipoDoacaoTexto}</p>
          {editando ? (
            <>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
              />
              <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} />
              <div className="botoes-salvar-cancelar">
                <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
                <button className="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
              </div>
            </>
          ) : (
            <>
              {comentario && <div className="comentario"><strong>Comentário:</strong> {comentario}</div>}
              <button className="btn-editar" onClick={() => setEditando(true)}>Editar</button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
