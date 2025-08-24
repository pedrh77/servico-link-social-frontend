import React, { useEffect, useState } from "react";
import "./EtapaEscolha.css";
import { getOngs } from "../../Api.js";

export default function EtapaEscolha() {
  const [usuario, setUsuario] = useState(null);
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongSelecionada, setOngSelecionada] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    setUsuario(usuarioLogado);

    async function fetchDados() {
      try {
        const ongsData = await getOngs();
        setOngs(ongsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  function handleEscolher(ong) {
    setOngSelecionada(ong);
  }

  function handleAvancar() {
    if (!ongSelecionada) {
      alert("Por favor, selecione uma ONG antes de avançar.");
      return;
    }
    sessionStorage.setItem("ongSelecionada", JSON.stringify(ongSelecionada));
    window.location.href = "/etapa-valores";
  }

  function handleSair() {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div className="container" role="main">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <img src="/img/logo-link.svg" alt="Logo" className="logo" />
          </div>
          <nav className="nav-header" aria-label="Navegação principal">
            {usuario ? (
              <button className="logout" onClick={handleSair} aria-label="Sair da conta">
                Sair
              </button>
            ) : (
              <>
                <a href="/login" className="login" aria-label="Entrar na conta">
                  Entrar
                </a>
                <button
                  className="signup"
                  onClick={() => (window.location.href = "/register")}
                  aria-label="Cadastrar nova conta"
                >
                  Cadastrar
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <h1 className="titulo">Escolha uma ONG</h1>

      <div className="grid-ongs">
        {ongs.map((ong) => (
          <div
            key={ong.id}
            className={`card-ong ${ongSelecionada?.id === ong.id ? "selecionada" : ""}`}
            tabIndex={0}
          >
            <div className="info-ong">
              <h3>{ong.nome}</h3>
              <div className="tag">
                <img className="estrela" src="/img/estrela.svg" alt="Estrela" />
                {ong.porcentagem} Lorem Ipsum
              </div>
              <button
                className="btn-escolher"
                onClick={() => handleEscolher(ong)}
                aria-label={`Escolher ${ong.nome}`}
              >
                {ongSelecionada?.id === ong.id ? "Selecionada" : "Escolher"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="btn-avancar-container">
        <button
          className="botao-avancar"
          onClick={handleAvancar}
          aria-label="Avançar para próxima etapa"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}