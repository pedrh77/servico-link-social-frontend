import React from "react";

export default function TipoDoacaoRadios({ tipoDoacao, setTipoDoacao, meses, setMeses, index }) {
  return (
    <div style={{ marginTop: "10px" }} onClick={(e) => e.stopPropagation()}>
      {/* Única / Mensal */}
      <input
        type="radio"
        id={`unica-${index}`}
        name={`tipoDoacao-${index}`}
        value="Única"
        checked={tipoDoacao === "Única"}
        onChange={() => {
          setTipoDoacao("Única");
          setMeses(null);
        }}
      />
      <label htmlFor={`unica-${index}`}>Única</label>

      <input
        type="radio"
        id={`mensal-${index}`}
        name={`tipoDoacao-${index}`}
        value="Mensal"
        checked={tipoDoacao === "Mensal"}
        onChange={() => setTipoDoacao("Mensal")}
      />
      <label htmlFor={`mensal-${index}`}>Mensal</label>

      {/* Meses */}
      {tipoDoacao === "Mensal" && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="radio"
            id={`6meses-${index}`}
            name={`meses-${index}`}
            value={6}
            checked={meses === 6}
            onChange={() => setMeses(6)}
          />
          <label htmlFor={`6meses-${index}`}>6 meses</label>

          <input
            type="radio"
            id={`12meses-${index}`}
            name={`meses-${index}`}
            value={12}
            checked={meses === 12}
            onChange={() => setMeses(12)}
          />
          <label htmlFor={`12meses-${index}`}>12 meses</label>
        </div>
      )}
    </div>
  );
}
