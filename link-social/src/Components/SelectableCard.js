import React from "react";
import "./SelectableCard.css";

export default function SelectableCard({ item, selecionado, onEscolher, children }) {
  return (
    <div
      className={`card-ong ${selecionado ? "selected" : ""}`}
      onClick={onEscolher}
    >
      <h3>{item.label}</h3>
    </div>
  );
}
