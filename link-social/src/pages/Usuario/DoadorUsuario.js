// DoadorUsuario.js
import React, { useState, useEffect } from "react";
import {
  GetDoacoesByDoador,
  GetCarteiraByUsuarioId,
  AprovaTransacaoWithCodigo,
} from "../../Api.js";
import AccordionSection from "../../Components/AccordionSection.js";
import DoacaoLista from "../../Components/DoacaoCardList.js"; // ✅ usar o componente certo
import Header from "../../Components/Header.js";
import "./DoadorUsuario.css";

export default function DoadorUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [carteira, setCarteira] = useState(null);

  // estados do modal
  const [showModal, setShowModal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

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

  const handleAbrirModal = (t) => {
    setTransacaoSelecionada(t);
    setShowModal(true);
  };

  const handleValidarCodigo = async () => {
    if (codigo.length !== 6) {
      alert("Digite o código de 6 dígitos.");
      return;
    }

    try {
      const usuarioStorage = JSON.parse(sessionStorage.getItem("usuarioLogado"));

      if (!usuarioStorage || !transacaoSelecionada) {
        alert("Dados insuficientes para validar a transação.");
        return;
      }

      const validacao = {
        ClienteId: usuarioStorage.id,
        CodigoValidacao: codigo,
        NovoStatus: 1,
      };

      const response = await AprovaTransacaoWithCodigo(
        transacaoSelecionada.id,
        validacao
      );

      if (response && response.sucesso) {
        alert("Transação confirmada com sucesso!");
        setShowModal(false);
        setCodigo("");
        setTransacaoSelecionada(null);

        const c = await GetCarteiraByUsuarioId(usuarioStorage.id);
        setCarteira(c);
      } else {
        alert("Erro ao registrar a doação.");
      }
    } catch (error) {
      console.error("Erro ao confirmar doação:", error);
      alert("Ocorreu um erro ao confirmar a doação.");
    }
  };

  return (
    <>
      <Header links={links} />

      {/* Minha Carteira */}
      <AccordionSection title="Minha Carteira">
        {!carteira ? (
          <p>Carregando carteira...</p>
        ) : (
          <div className="carteira-container">
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
                              className={`tipo-transacao ${
                                t.tipo?.toLowerCase() === "credito" || t.tipo === 1
                                  ? "credito"
                                  : "debito"
                              }`}
                            >
                              {t.tipo?.toLowerCase() === "credito" || t.tipo === 1
                                ? "Crédito"
                                : "Débito"}
                            </span>
                            <span>R$ {t.valor.toFixed(2)}</span>
                          </div>
                          <span className="transacao-data">
                            {new Date(t.data).toLocaleDateString("pt-BR")}
                          </span>

                          {(t.tipo?.toLowerCase() === "debito" || t.tipo === 2) &&
                          t.status !== "Aprovado" ? (
                            <button
                              className="btn-acao"
                              onClick={() => handleAbrirModal(t)}
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

      {/* Doações */}
      <div className="ong-usuario">
        <AccordionSection title="Doações">
            <div>
            <button
              className="btn-escolher"
              onClick={() => (window.location.href = "/etapa-selecao")}
            >
              Nova doação
            </button>
          </div>
          {doacoes.length === 0 ? (
            <p>Você ainda não realizou uma doação.</p>
          ) : (
            <DoacaoLista doacoes={doacoes} />
          )}

        
        </AccordionSection>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Digite o código de confirmação</h3>
            <input
              type="text"
              maxLength="6"
              value={codigo}
              onChange={(e) =>
                setCodigo(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              placeholder="******"
              className="input-codigo"
            />
            <div className="modal-botoes">
              <button
                className="botao-cancelar"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="botao-confirmar" onClick={handleValidarCodigo}>
                Validar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
