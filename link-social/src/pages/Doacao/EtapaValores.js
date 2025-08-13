import React, { useState } from "react";
import "./EtapaValores.css";

const opcoesDoacao = [
  {
    valor: "R$ 5,00",
    beneficios: [
      "Desconto de 10% em restaurantes parceiros",
      "1 café grátis em cafeterias participantes",
    ],
    extraMensal: ["3 meses", "6 meses", "12 meses"],
  },
  {
    valor: "R$ 10,00",
    beneficios: [
      "Desconto de 15% em restaurantes parceiros",
      "2 cafés grátis em cafeterias participantes",
      "Desconto de 10% em lojas parceiras",
    ],
    extraMensal: ["3 meses", "6 meses", "12 meses"],
  },
  {
    valor: "R$ 20,00",
    beneficios: [
      "Desconto de 20% em restaurantes parceiros",
      "3 cafés grátis em cafeterias participantes",
      "Desconto de 15% em lojas parceiras",
      "1 sessão de cinema grátis",
    ],
    extraMensal: ["3 meses", "6 meses", "12 meses"],
  },
  {
    valor: "R$ 50,00",
    beneficios: [
      "Desconto de 15% em restaurantes parceiros",
      "2 cafés grátis em cafeterias participantes",
      "Desconto de 10% em lojas parceiras",
    ],
    extraMensal: ["6 meses", "12 meses"],
  },
];

export default function EtapaDoacao() {
  const [mensalExpandido, setMensalExpandido] = useState(null);
  const [mesesEscolhidos, setMesesEscolhidos] = useState({});
  const [unicaSelecionada, setUnicaSelecionada] = useState(null);
  const [logado, setLogado] = useState(false);

  function toggleMensal(index) {
    if (mensalExpandido === index) {
      setMensalExpandido(null);
    } else {
      setMensalExpandido(index);
      setUnicaSelecionada(null);
    }
  }

  function escolherMes(index, mes) {
    setMesesEscolhidos((prev) => ({ ...prev, [index]: mes }));
  }

  function escolherUnica(index) {
    setMensalExpandido(null);
    setMesesEscolhidos((prev) => {
      const novo = { ...prev };
      delete novo[index];
      return novo;
    });
    setUnicaSelecionada(index);
  }

  function finalizarDoacao() {
    if (!logado) {
      alert("Você precisa entrar na sua conta para finalizar a doação.");
      window.location.href = "/login";
      return;
    }
    alert("Obrigado pela doação!");
  }

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
              type="button"
              className="signup"
              onClick={() => (window.location.href = "/register")}
              aria-label="Cadastrar nova conta"
            >
              Cadastrar
            </button>
          </nav>
        </div>
      </header>

      <h1 className="titulo">Selecione o Valor da Doação</h1>

      <div className="grid-cards">
        {opcoesDoacao.map((item, index) => {
          const expandido = mensalExpandido === index;
          const mesSelecionado = mesesEscolhidos[index] || null;
          const unicaAtiva = unicaSelecionada === index;

          return (
            <div key={index} className="card-doacao" aria-labelledby={`valor-${index}`}>
              <h3 id={`valor-${index}`}>{item.valor}</h3>

              <ul>
                {item.beneficios.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="acoes-doacao" role="group" aria-label={`Opções de pagamento para ${item.valor}`}>
                <button
                  type="button"
                  className={`btn-escolher ${unicaAtiva ? "ativo" : ""}`}
                  onClick={() => escolherUnica(index)}
                >
                  Única
                </button>

                <button
                  type="button"
                  className={`btn-escolher ${expandido ? "ativo" : ""}`}
                  aria-expanded={expandido}
                  onClick={() => toggleMensal(index)}
                >
                  Mensal
                </button>
              </div>

              <div className={`opcoes-extra ${expandido ? "expandido" : ""}`} aria-hidden={!expandido}>
                <span className="texto-meses">Escolha a duração:</span>
                <div className="opcoes-meses">
                  {(item.extraMensal.length ? item.extraMensal : ["3 meses", "6 meses", "12 meses"]).map(
                    (op, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`btn-extra ${mesSelecionado === op ? "selecionado" : ""}`}
                        onClick={() => escolherMes(index, op)}
                      >
                        {op}
                      </button>
                    ) 
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="btn-avancar-container">
        <button type="button" className="botao-avancar" onClick={finalizarDoacao}>
          Finalizar
        </button>
      </div>
    </div>
  );
}
