import React, { useState } from "react";
import "./DoacaoCardList.css";

export default function DoacaoLista({ doacoes = [], tipoUsuario = "doador" }) {
  const [comentarioAberto, setComentarioAberto] = useState(null);
  const [parcelasAberta, setParcelasAberta] = useState(null); // único estado de expansão
  const agruparDoacoes = (lista) => {
    if (!Array.isArray(lista)) return [];
    const mapa = {};
    lista.forEach((d) => {
      if (d.doacaoPrincipalId) {
        if (!mapa[d.doacaoPrincipalId])
          mapa[d.doacaoPrincipalId] = { parcelas: [] };
        mapa[d.doacaoPrincipalId].parcelas.push(d);
      } else {
        mapa[d.id] = { ...d, parcelas: [] };
      }
    });
    return Object.values(mapa).filter((d) => d.valor !== undefined);
  };

  const tipoDoacaoTexto = (tipo) => {
    switch (tipo) {
      case 0: return "Parcela";
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

  const handlePagarParcela = (doacao) => {
    sessionStorage.setItem("doacaoParcela", JSON.stringify(doacao));
    console.log(doacao);
    alert();
    window.location.href = "/etapa-final";
  };

  const doacoesAgrupadas = agruparDoacoes(doacoes);

  return (
    <ul className="lista-doacoes">
      <li className={`lista-header ${tipoUsuario === "ong" ? "onglista" : "doadorlista"}`}>
        {tipoUsuario === "ong" && <span>Doador</span>}
        <span>Valor</span>
        <span>Tipo</span>
        <span>Status</span>
        <span>Comentário</span>
        {tipoUsuario === "doador" && <span>Anonima</span>}
      </li>

      {doacoesAgrupadas.map((doacao) => {
        const parcelasOrdenadas = [...doacao.parcelas].sort(
          (a, b) => a.numeroParcela - b.numeroParcela
        );

        

        const isMensal = doacao.tipoDoacao === 2 || doacao.tipoDoacao === 3;
        const aberto = parcelasAberta === doacao.id;

        return (
          <React.Fragment key={doacao.id}>
            {/* Linha principal da doação */}
            <li
              className={`lista-item principal-item ${isMensal ? "parcela-existente" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setParcelasAberta(aberto ? null : doacao.id);
              }}
              style={{ cursor: isMensal ? "pointer" : "default" }}
            >
              {tipoUsuario === "ong" && (
                <span>
                  {doacao.anonima ||
                    doacao.nomeDoador === "True" ||
                    doacao.nomeDoador === "False"
                    ? "Anônimo"
                    : doacao.nomeDoador}
                </span>
              )}

              <span>R$ {doacao.valor?.toFixed(2) || "-"}</span>
              <span>{tipoDoacaoTexto(doacao.tipoDoacao)}</span>
              <span>{statusDoacaoTexto(doacao.statusPagamento)}</span>

              <span
                className="comentario-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setComentarioAberto(comentarioAberto === doacao.id ? null : doacao.id);
                }}
              >
                {doacao.comentario ? "Ver comentário" : "-"}
              </span>

              {tipoUsuario === "doador" && (
                <span>
                  <input type="checkbox" checked={doacao.anonima} readOnly />
                </span>
              )}
            </li>

            {/* Comentário expandido */}
            {comentarioAberto === doacao.id && doacao.comentario && (
              <li className="comentario-expandido">
                <span>{doacao.comentario}</span>
              </li>
            )}

            {/* Parcelas detalhadas */}
            {isMensal && aberto && (
              parcelasOrdenadas.map((parcela) => (
                <li key={parcela.id} className="lista-item parcela-item">
                  {tipoUsuario === "ong" && (
                    <span>
                      {parcela.anonima ||
                        parcela.nomeDoador === "True" ||
                        parcela.nomeDoador === "False"
                        ? "Anônimo"
                        : parcela.nomeDoador}
                    </span>
                  )}

                  <span>R$ {parcela.valor?.toFixed(2) || "-"}</span>
                  <span>{tipoDoacaoTexto(parcela.tipoDoacao)}</span>
                  <span>{statusDoacaoTexto(parcela.statusPagamento)}</span>
                  <span>
                    Parcela {parcela.numeroParcela+1}/{parcela.totalParcelas}
                  </span>
                </li>
              ))
            )}

            {/* Botão pagar próxima parcela (sempre mostra se houver) */}
            {isMensal && parcelasAberta && tipoUsuario === "doador" && (
              <li className="lista-item parcela-item botao-item">
                <button
                  className="btn-acao"
                  onClick={() => {
                    if (!aberto) {
                      setParcelasAberta(doacao.id); 
                    }
                    handlePagarParcela(doacao);
                  }}
                >
                  Realizar pagamento da parcela
               
                </button>
              </li>
            )}
          </React.Fragment>
        );
      })}

    </ul>
  );
}
