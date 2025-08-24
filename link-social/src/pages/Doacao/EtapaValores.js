import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EtapaValores.css";
import { getBeneficios } from "../../Api.js";

export default function EtapaDoacao() {
  const [beneficios, setBeneficios] = useState([]);
  const [beneficioSelecionado, setBeneficioSelecionado] = useState(null);
  const [tipoDoacao, setTipoDoacao] = useState("Única");
  const [meses, setMeses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    setUsuario(usuarioLogado);

    async function fetchBeneficios() {
      const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada"));
      if (!ongSelecionada) {
        alert("Nenhuma ONG selecionada!");
        window.location.href = "/etapa-escolha";
        return;
      }
      try {
        const lista = await getBeneficios();
        setBeneficios(lista);
      } catch (error) {
        console.error("Erro ao buscar benefícios:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBeneficios();
  }, []);

  function selecionarBeneficio(index) {
    if (beneficioSelecionado === index) {
      setBeneficioSelecionado(null);
      setTipoDoacao("Única");
      setMeses(null);
    } else {
      setBeneficioSelecionado(index);
      setTipoDoacao("Única");
      setMeses(null);

      // Scroll suave até o cartão expandido
      setTimeout(() => {
        const element = document.getElementById(`card-${index}`);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }

  function finalizarDoacao(index) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      sessionStorage.setItem("retornoAposLogin", window.location.pathname);
      alert("Você precisa entrar na sua conta para finalizar a doação.");
      window.location.href = "/login";
      return;
    }

    const beneficio = beneficios[index];
    if (!beneficio) {
      alert("Selecione um benefício antes de continuar.");
      return;
    }

    if (tipoDoacao === "Mensal" && !meses) {
      alert("Selecione a duração da doação mensal (6 ou 12 meses).");
      return;
    }

    const doacao = {
      ong: beneficio.nomeEmpresa,
      ongId: beneficio.empresaId,
      valor: beneficio.valor.toFixed(2),
      tipo: tipoDoacao,
      meses: tipoDoacao === "Mensal" ? meses : null,
      beneficioId: beneficio.id,
      doadorId: usuarioLogado.id,
    };

    sessionStorage.setItem("doacaoSelecionada", JSON.stringify(doacao));
    navigate("/etapa-final");
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="container">
      <h1 className="titulo">Selecione o Valor da Doação</h1>
      <div className="grid-cards">
        {beneficios.map((b, index) => (
          <div
            key={b.id}
            id={`card-${index}`}
            className={`card-doacao ${beneficioSelecionado === index ? "selecionado" : ""}`}
          >
            <h3 onClick={() => selecionarBeneficio(index)}>R$ {b.valor.toFixed(2)}</h3>

            {beneficioSelecionado === index && (
              <div className="beneficios-extra expandido">
                <p><strong>Você tem direito aos seguintes benefícios:</strong></p>
                <ul>
                  <li>{b.nomeEmpresa} - {b.descricao}</li>
                </ul>
                <p>Além disso, você terá R$ {(b.valor * 2).toFixed(2)} para usar nos parceiros 💚</p>

                <div style={{ marginTop: "10px" }}>
                  <input type="radio" id={`unica-${index}`} name="tipoDoacao" value="Única"
                    checked={tipoDoacao === "Única"}
                    onChange={() => { setTipoDoacao("Única"); setMeses(null); }} />
                  <label htmlFor={`unica-${index}`}>Única</label>

                  <input type="radio" id={`mensal-${index}`} name="tipoDoacao" value="Mensal"
                    checked={tipoDoacao === "Mensal"}
                    onChange={() => setTipoDoacao("Mensal")} />
                  <label htmlFor={`mensal-${index}`}>Mensal</label>
                </div>

                {tipoDoacao === "Mensal" && (
                  <div style={{ marginTop: "10px" }}>
                    <input type="radio" id={`6meses-${index}`} name="meses" value={6}
                      checked={meses === 6} onChange={() => setMeses(6)} />
                    <label htmlFor={`6meses-${index}`}>6 meses</label>

                    <input type="radio" id={`12meses-${index}`} name="meses" value={12}
                      checked={meses === 12} onChange={() => setMeses(12)} />
                    <label htmlFor={`12meses-${index}`}>12 meses</label>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="btn-avancar-container">
        <button
          className="botao-avancar"
          disabled={beneficioSelecionado === null || (tipoDoacao === "Mensal" && !meses)}
          onClick={() => finalizarDoacao(beneficioSelecionado)}
        >
          Finalizar Doação
        </button>
      </div>
    </div>
  );
}
