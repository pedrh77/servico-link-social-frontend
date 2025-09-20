import React, { useState } from "react";
import "./DoacaoCardList.css";

export default function DoacaoLista({ doacoes = [] }) {
  const [expandido, setExpandido] = useState({});

  const agruparDoacoes = (lista) => {
    if (!Array.isArray(lista)) return [];
    const mapa = {};
    lista.forEach((d) => {
      if (d.doacaoPrincipalId) {
        if (!mapa[d.doacaoPrincipalId]) mapa[d.doacaoPrincipalId] = { parcelas: [] };
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

  const nomeDoador = (doacao) =>
    doacao.anonima || doacao.nomeDoador === "True" || doacao.nomeDoador === "False"
      ? "Anônimo"
      : doacao.nomeDoador;

  const handlePagarParcela = (parcela) => {
    sessionStorage.setItem("doacaoSelecionada", JSON.stringify(parcela));
    console.log("Parcela selecionada para pagamento:", parcela);
    window.location.href = "/transacao-validacao";
  };

  const doacoesAgrupadas = agruparDoacoes(doacoes);
  const toggleExpandido = (id) => setExpandido(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <ul className="lista-doacoes">
      {/* Cabeçalho */}
      <li className="lista-header">
        <span>Doador</span>
        <span>Valor</span>
        <span>Tipo</span>
        <span>Status</span>
        <span>Comentário</span>
      </li>

      
        doacoesAgrupadas.map((doacao) => {
          // Próxima parcela não paga
          const proximaParcela = doacao.parcelas
            .sort((a, b) => a.numeroParcela - b.numeroParcela)
            .find(p => p.statusPagamento !== 3);

          return (
            <React.Fragment key={doacao.id}>
              {/* Doação principal */}
              <li
                className="lista-item principal-item"
                onClick={() => toggleExpandido(doacao.id)}
                style={{ cursor: doacao.parcelas.length ? "pointer" : "default" }}
              >
                <span>
                  {doacao.parcelas.length > 0 && (
                    <span style={{ marginRight: 6 }}>
                      {expandido[doacao.id] ? "▼" : "►"}
                    </span>
                  )}
                  {nomeDoador(doacao)}
                </span>
                <span>R$ {doacao.valor.toFixed(2)}</span>
                <span>{tipoDoacaoTexto(doacao.tipoDoacao)}</span>
                <span>{statusDoacaoTexto(doacao.statusPagamento)}</span>
                <span>
                  {doacao.comentario || "-"}
                </span>
              </li>

              {/* Parcelas */}
              {doacao.parcelas.length > 0 && expandido[doacao.id] && (
                <>
                  {doacao.parcelas
                    .sort((a, b) => a.numeroParcela - b.numeroParcela)
                    .map((parcela) => (
                      <li key={parcela.id} className="lista-item parcela-item">
                        <span>{nomeDoador(doacao)}</span>
                        <span>R$ {parcela.valor.toFixed(2)}</span>
                        <span>{tipoDoacaoTexto(parcela.tipoDoacao)}</span>
                        <span>{statusDoacaoTexto(parcela.statusPagamento)}</span>
                        <span>
                          Parcela {parcela.numeroParcela}/{parcela.totalParcelas}
                        </span>
                      </li>
                    ))
                  }

                  {/* Botão só aparece quando expandido */}
                  {proximaParcela && (
                    <li className="lista-item parcela-item botao-item">
                      <span colSpan={5}>
                        <button
                          className="btn-acao"
                          onClick={() => handlePagarParcela(doacao)}
                        >
                          Realizar próximo pagamento
                        </button>
                      </span>
                    </li>
                  )}
                </>
              )}
            </React.Fragment>
          );
        )
    </ul>
  );
}
