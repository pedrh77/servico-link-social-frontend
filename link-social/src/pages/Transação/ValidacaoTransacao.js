import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import "./ValidacaoTransacao.css";

const links = [
  { label: "Inicio", path: "/Home" },
  { label: "Meu Perfil", path: "/Usuario" },
];

export default function ValidacaoTransacao() {
  const [transacao, setTransacao] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    try {
      const transacaoStorage = sessionStorage.getItem("transacao");
      const usuarioStorage = sessionStorage.getItem("usuarioLogado");
      const empresaStorage = sessionStorage.getItem("empresaSelecionada");

      if (transacaoStorage && usuarioStorage && empresaStorage) {
        setTransacao(JSON.parse(transacaoStorage));
        setUsuario(JSON.parse(usuarioStorage));
        setEmpresa(JSON.parse(empresaStorage));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do sessionStorage:", err);
    }
  }, []);

  const handleConfirmar = () => {
    setShowModal(true);
  };

  const handleValidarCodigo = () => {
    if (codigo.length !== 6) {
      alert("Digite o código de 6 dígitos.");
      return;
    }

    console.log("Transação confirmada:", transacao, "Código:", codigo);
    alert("✅ Transação confirmada com sucesso!");
    sessionStorage.removeItem("transacao");
    window.location.href = "/Home";
  };

  if (!transacao || !empresa || !usuario) {
    return (
      <div className="resumo-container">
        <p>⚠️ Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <Header links={links} />

      <div className="resumo-container">
        <h2 className="titulo-card">Resumo da Transação</h2>

        <div className="card-resumo">
          <p>
            <b>Doador:</b> {usuario.nome}
          </p>
          <p>
            <b>Empresa:</b> {empresa.nome}
          </p>
          <p>
            <b>Valor da Conta:</b> R$ {transacao.valorTotal.toFixed(2)}
          </p>
          <p>
            <b>Valor a Usar:</b> R$ {transacao.valor.toFixed(2)}
          </p>
        </div>

        <section className="confirmar-container">
          <button className="botao-confirmar" onClick={handleConfirmar}>
            Confirmar Transação
          </button>
        </section>
      </div>

      {/* Modal para código */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Digite o código de confirmação</h3>
            <input
              type="text"
              maxLength="6"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
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
