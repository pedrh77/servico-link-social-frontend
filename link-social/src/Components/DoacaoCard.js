import React from "react";
import TipoDoacaoRadios from "./TipoDoacaoRadio";
import "./DoacaoCard.css";

export default function DoacaoCard({
  valor,
  index,
  selecionado,
  selecionarValor,
  tipoDoacao,
  setTipoDoacao,
  meses,
  setMeses,
}) {
  const item = { id: index, label: `R$ ${valor.toFixed(2)}` };

  return (
    <div
      className={`card-doacao ${selecionado ? "selecionado" : ""}`}
      onClick={() => selecionarValor(valor)}
    >
      <h3>{item.label}</h3>

      {selecionado && (
        <div className="beneficios-extra expandido">
          <p><strong>Você escolheu doar:</strong> R$ {valor.toFixed(2)}</p>
          <p>Com isso, você ainda terá <strong>R$ {(valor * 2).toFixed(2)}</strong> em benefícios 💚</p>

          <TipoDoacaoRadios
            tipoDoacao={tipoDoacao}
            setTipoDoacao={setTipoDoacao}
            meses={meses}
            setMeses={setMeses}
            index={index}
          />
        </div>
      )}
    </div>
  );
}
