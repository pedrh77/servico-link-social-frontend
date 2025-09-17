import React, { useState, useEffect } from "react";
import { GetDoacoesByDoador, GetCarteiraByUsuarioId } from "../../Api.js";
import AccordionSection from "../../Components/AccordionSection.js";
import CardDoacao from "../../Components/DoacaoCardList.js";
import Header from "../../Components/Header.js";
import "./DoadorUsuario.css";

export default function DoadorUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [carteira, setCarteira] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      if (dados?.id) {
       const lista = await GetDoacoesByDoador(dados.id);
        setDoacoes(lista);

        const c = await GetCarteiraByUsuarioId(dados.id);
        setCarteira(c);

        sessionStorage.setItem("saldo", c.saldo);
        console.log("Carteira carregada:", c.saldo);
      }
    }
    carregarDados();
  }, [dados?.id]);

  function agruparPorStatus(transacoes) {
    return transacoes.reduce((acc, t) => {
      const status = t.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(t);
      return acc;
    }, {});
  }

  const links = [
    { label: "Inicio", path: "/Home" },
    { label: "Doe Agora", path: "/etapa-selecao" },
  ];

  return (
    <>
      <Header links={links} />

      <AccordionSection title="Minha Carteira">
        {!carteira ? (
          <p>Carregando carteira...</p>
        ) : (
          <div className="carteira-container">
            {/* Card de saldo */}
            <div className="saldo-card">
              <p className="saldo-label">Saldo disponível</p>
              <p className="saldo-valor">R$ {carteira.saldo.toFixed(2)}</p>
              <button
                className="btn-acao"
                onClick={() => (window.location.href = "/transacao")}
              >
                Usar Saldo
              </button>
            </div>

            <div className="transacoes-container">
              {Object.entries(agruparPorStatus(carteira.transacoes)).map(
                ([status, transacoes]) => (
                  <div key={status} className="transacao-grupo">
                    <h4 className="grupo-titulo">{status}</h4>
                    <ul className="transacao-lista">
                      {transacoes.map((t) => (
                        <li key={t.id} className="transacao-item">
                          <div className="transacao-info">
                            <span
                              className={`tipo-transacao ${t.tipo?.toLowerCase() === "credito" || t.tipo === 1
                                  ? "credito"
                                  : "debito"
                                }`}
                            >
                              {t.tipo?.toLowerCase() === "credito" || t.tipo === 1
                                ? "Crédito"
                                : "Débito"}
                            </span>
                            <span>- R$ {t.valor.toFixed(2)}</span>
                          </div>
                          <span className="transacao-data">
                            {new Date(t.data).toLocaleDateString("pt-BR")}
                          </span>

                          {/* Botão de selecionar */}
                          {t.tipo?.toLowerCase() === "credito" || t.tipo === 1 ? (
                            <button
                              className="btn-acao"
                              onClick={() => {
                                const transacaoSelecionada = {
                                  id: t.id,
                                  valor: t.valor,
                                  data: t.data,
                                  tipo: t.tipo,
                                  status: t.status,
                                  valorTotal: t.valor, // pode ser ajustado se for só parte
                                };
                                sessionStorage.setItem(
                                  "transacao",
                                  JSON.stringify(transacaoSelecionada)
                                );
                                window.location.href = "/transacao-validacao";
                              }}
                            >
                              Aprovação
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </AccordionSection>

      <div className="ong-usuario">
        <AccordionSection title="Doações Feitas">
          {doacoes.length === 0 ? (
            <p>Você ainda não realizou uma doação.</p>
          ) : (
            <ul className="lista-doacoes">
              <li className="lista-header">
                <span>Doador</span>
                <span>Valor</span>
                <span>Tipo</span>
                <span>Status</span>
                <span>Comentário</span>
              </li>
              {doacoes.map((d) => (
                <CardDoacao key={d.id} doacao={d} />
              ))}
            </ul>
          )}
          <div>
            <button
              className="btn-escolher"
              onClick={() => (window.location.href = "/etapa-selecao")}
            >
              Realizar doação.
            </button>
          </div>
        </AccordionSection>
      </div>
    </>
  );
}
