import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EtapaValores.css";
import DoacaoCard from "../../Components/DoacaoCard";
import Header from "../../Components/Header";

export default function EtapaDoacao() {
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [tipoDoacao, setTipoDoacao] = useState("Única");
  const [meses, setMeses] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    setUsuario(usuarioLogado);

    const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada"));
    if (!ongSelecionada) {
      alert("Nenhuma ONG selecionada!");
      window.location.href = "/etapa-escolha";
    }
  }, []);

  const valoresFixos = [5, 10, 20, 50];

  function selecionarValor(valor) {
    if (valorSelecionado === valor) {
      setValorSelecionado(null);
      setTipoDoacao("Única");
      setMeses(null);
    } else {
      setValorSelecionado(valor);
      setTipoDoacao("Única");
      setMeses(null);
    }
  }

  function finalizarDoacao() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      sessionStorage.setItem("retornoAposLogin", window.location.pathname);
      alert("Você precisa entrar na sua conta para finalizar a doação.");
      window.location.href = "/login";
      return;
    }

    if (!valorSelecionado) {
      alert("Selecione um valor antes de continuar.");
      return;
    }

    if (tipoDoacao === "Mensal" && !meses) {
      alert("Selecione a duração da doação mensal (6 ou 12 meses).");
      return;
    }

    const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada"));

    
    let tipoDoacaoEnum;
    if (tipoDoacao === "Única") {
      tipoDoacaoEnum = 1;
    } else if (tipoDoacao === "Mensal" && meses === 6) {
      tipoDoacaoEnum = 2;
    } else if (tipoDoacao === "Mensal" && meses === 12) {
      tipoDoacaoEnum = 3;
    } else {
      tipoDoacaoEnum = 0; 
    }

    const doacao = {
      nomeOng: ongSelecionada.nome,
      ongId: ongSelecionada.id,
      descricaoOng: ongSelecionada.comentario,
      valor: valorSelecionado.toFixed(2),
      tipoDoacao: tipoDoacaoEnum,
      tipoDescricao: tipoDoacao,
      doadorId: usuarioLogado.id,
    };

    sessionStorage.setItem("doacaoSelecionada", JSON.stringify(doacao));
    sessionStorage.setItem("doacaoParcela", null);
    navigate("/etapa-final");
  }

  const links = [
    { label: "Inicio", path: "/Home" },
    { label: "Meu Perfil", path: "/Usuario" }
  ];

  return (
    <div className="container">
      <Header links={links} />
      <h1 className="titulo">Selecione o Valor da Doação</h1>
      <div className="grid-cards">
        {valoresFixos.map((valor, index) => (


          <DoacaoCard
            key={index}
            valor={valor}
            index={index}
            selecionado={valorSelecionado === valor}
            selecionarValor={setValorSelecionado}
            tipoDoacao={tipoDoacao}
            setTipoDoacao={setTipoDoacao}
            meses={meses}
            setMeses={setMeses}
          />

        ))}
      </div>

      <div className="btn-avancar-container">
        <button
          className="botao-avancar"
          disabled={valorSelecionado === null || (tipoDoacao === "Mensal" && !meses)}
          onClick={finalizarDoacao}
        >
          Finalizar Doação
        </button>
      </div>
    </div>
  );
}
