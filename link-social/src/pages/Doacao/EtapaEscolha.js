import React from "react";
import "./EtapaEscolha.css";

const ongs = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nome: `ONG ${i + 1}`,
  porcentagem: "15%",
}));

export default function EtapaEscolha() {
  return (
    <div className="container" role="main">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <img src="/img/logo-link.svg" alt="Logo" className="logo" />
          </div>

          <nav className="nav-header" aria-label="Navegação principal">
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
          </nav>
        </div>
      </header>

      <h1 className="titulo">Escolha uma ONG</h1>

      <div className="grid-ongs">
        {ongs.map((ong) => (
          <div key={ong.id} className="card-ong" tabIndex={-1}>
            <div className="info-ong">
              <h3>{ong.nome}</h3>
              <div className="tag">
                <img className="estrela" src="/img/estrela.svg" alt="Estrela" />
                {ong.porcentagem} Lorem Ipsum
              </div>
              <button className="btn-escolher" aria-label={`Escolher ${ong.nome}`}>
                Escolher
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="btn-avancar-container">
        <button className="botao-avancar" aria-label="Avançar para próxima etapa">
          Avançar
        </button>
      </div>
    </div>
  );
}
