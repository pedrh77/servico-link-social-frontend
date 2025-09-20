import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import "./ValidacaoTransacao.css";
import { NovaTransacao } from "../../Api";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Inicio", path: "/Home" },
  { label: "Meu Perfil", path: "/Usuario" },
];

export default function ValidacaoTransacao() {
  const [transacao, setTransacao] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [codigo, setCodigo] = useState("");

  const navigate = useNavigate();

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

  const handleConfirmar = async () => {
    try {
      const novaDoacao = {
        doadorId: usuario.id,
        empresaId: empresa.id,
        tipo: 2, // Doação
        valor: transacao.valor,
        valorTotal: transacao.valorTotal,
      };

      console.log("Enviando nova doação:", novaDoacao);

      const response = await NovaTransacao(novaDoacao);

      if (response && response.sucesso) {
        // Redireciona para /Usuario após sucesso
        navigate("/Usuario");
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
    </>
  );
}
