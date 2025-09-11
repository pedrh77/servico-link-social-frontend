import React from "react";
import "./SelectableCard.css";

export default function SelectableCard({ item, selecionado, onEscolher, children }) {
  return (
    <div
      className={`card-ong ${selecionado ? "selected" : ""}`}
      onClick={onEscolher} // atualiza o pai
    >
      <h3>{item.label}</h3>
      {selecionado && children} {}
    </div>
  );
}
