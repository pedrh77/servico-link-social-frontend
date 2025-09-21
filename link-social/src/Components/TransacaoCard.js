import React from "react";

export default function TransacaoCard({ transacao }) {
  const tipoLabels = {
    1: "Crédito",
    2: "Débito",
  };

  const statusLabels = {
    0: "Pendente",
    1: "Aprovado",
    2: "Rejeitado",
    3: "Pago",
    4: "Cancelado",
    5: "Concluido",
  };

  const statusClasses = {
    Pendente: "pendente",
    Aprovado: "aprovado",
    Rejeitado: "rejeitado",
    Pago: "pago",
    Cancelado: "cancelado",
    Concluido: "concluido",
  };

  
  const statusText = typeof transacao.status === "number" 
    ? statusLabels[transacao.status] 
    : transacao.status;

  const statusClass = statusClasses[statusText] || "";

  return (
    <li className="item-transacao">
      <div className="linha">
        <span>R$ {transacao.valor.toFixed(2)}</span>
      </div>
      <div className="linha">
        <span>{new Date(transacao.data).toLocaleDateString("pt-BR")}</span>
      </div>
      <div className="linha">
        <span className={`status ${statusClass}`}>{statusText}</span>
      </div>
      <div className="linha">
        <span>{tipoLabels[transacao.tipo]}</span>
      </div>
      <div className="linha">
        <span>{transacao.receiverId ?? "-"}</span>
      </div>
    </li>
  );
}
