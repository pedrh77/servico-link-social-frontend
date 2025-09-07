import React from "react";
import "./DoacaoCard.css";

export default function DoacaoLista({ doacao }) {

  const tipoDoacaoTexto = (tipo) => {
    switch (tipo) {
      case 1: return "Única";
      case 2: return "Mensal 6x";
      case 3: return "Mensal 12x";
      default: return "-";
    }
  };

  const statusDoacaoTexto = (status) => {
    switch (status) {
      case 0: return "Pendente";
      case 1: return "Aprovado";
      case 2: return "Rejeitado";
      case 3: return "Pago";
      case 4: return "Cancelado";
      case 5: return "Concluído";
      default: return "-";
    }
  };

  const nomeDoador = doacao.anonima || doacao.nomeDoador === "True" || doacao.nomeDoador === "False"
    ? "Anônimo"
    : doacao.nomeDoador;

  return (
    <li key={doacao.id} className="lista-item">
      <span>{nomeDoador}</span>
      <span>R$ {doacao.valor.toFixed(2)}</span>
      <span>{tipoDoacaoTexto(doacao.tipoDoacao)}</span>
      <span>{statusDoacaoTexto(doacao.statusPagamento)}</span>
      <span>{doacao.comentario || "-"}</span>
    </li>

  );
}
