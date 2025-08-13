import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EtapaValores.css";
import { getBeneficiosPorOngId } from "../../Api.js";

export default function EtapaDoacao() {
  const [beneficios, setBeneficios] = useState([]);
  const [mensalExpandido, setMensalExpandido] = useState(null);
  const [mesesEscolhidos, setMesesEscolhidos] = useState({});
  const [unicaSelecionada, setUnicaSelecionada] = useState(null);
  const [logado, setLogado] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBeneficios() {
      const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada"));
      if (!ongSelecionada) {
        alert("Nenhuma ONG selecionada!");
        window.location.href = "/etapa-escolha";
        return;
      }
      try {
        const lista = await getBeneficiosPorOngId(ongSelecionada.id);
        setBeneficios(lista);
      } catch (error) {
        console.error("Erro ao buscar benefícios:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBeneficios();
  }, []);

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
  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  
  if (!usuarioLogado) {
    sessionStorage.setItem("retornoAposLogin", window.location.pathname);
    alert("Você precisa entrar na sua conta para finalizar a doação.");
    window.location.href = "/login"; // redireciona para login
    return;
  }

  const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada"));
  if (!ongSelecionada) return;

  const indexSelecionado = unicaSelecionada ?? mensalExpandido;
  const beneficio = beneficios[indexSelecionado];

  if (!beneficio) {
    alert("Selecione um benefício antes de continuar.");
    return;
  }

  const doacao = {
    ong: ongSelecionada.nome,
    ongId: ongSelecionada.id,
    valor: beneficio.valor.toFixed(2),
    tipo: unicaSelecionada === indexSelecionado ? "Única" : "Mensal",
    meses: mesesEscolhidos[indexSelecionado] || (unicaSelecionada === indexSelecionado ? null : 12),
    beneficioId: beneficio.id,
    doadorId: usuarioLogado.id,
  };

  sessionStorage.setItem("doacaoSelecionada", JSON.stringify(doacao));
  console.log("Doação selecionada:", doacao);

  navigate("/etapa-final");
}

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="container" role="main">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <img src="/img/logo-link.svg" alt="Logo" className="logo" />
          </div>
          <nav className="nav-header">
            <a href="/login" className="login">
              Entrar
            </a>
            <button className="signup" onClick={() => (window.location.href = "/register")}>
              Cadastrar
            </button>
          </nav>
        </div>
      </header>

      <h1 className="titulo">Selecione o Valor da Doação</h1>

      <div className="grid-cards">
        {beneficios.map((b, index) => {
          const expandido = mensalExpandido === index;
          const mesSelecionado = mesesEscolhidos[index] || null;
          const unicaAtiva = unicaSelecionada === index;

          return (
            <div key={b.id} className="card-doacao" aria-labelledby={`valor-${index}`}>
              <h3 id={`valor-${index}`}>R$ {b.valor.toFixed(2)}</h3>
              <p>{b.descricao}</p>

              <div className="acoes-doacao" role="group">
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
                  {[6, 12].map((mes) => (
                    <button
                      key={mes}
                      type="button"
                      className={`btn-extra ${mesSelecionado === mes ? "selecionado" : ""}`}
                      onClick={() => escolherMes(index, mes)}
                    >
                      {mes} meses
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="btn-avancar-container">
        <button className="botao-avancar" onClick={finalizarDoacao}>
          Finalizar
        </button>
      </div>
    </div>
  );
}
