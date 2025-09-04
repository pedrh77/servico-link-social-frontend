import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EtapaValores.css";

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

    const doacao = {
      ong: ongSelecionada.nome,
      ongId: ongSelecionada.id,
      valor: valorSelecionado.toFixed(2),
      tipo: tipoDoacao,
      meses: tipoDoacao === "Mensal" ? meses : null,
      doadorId: usuarioLogado.id,
    };

    sessionStorage.setItem("doacaoSelecionada", JSON.stringify(doacao));
    navigate("/etapa-final");
  }

  return (
    <div className="container">
      <h1 className="titulo">Selecione o Valor da Doação</h1>
      <div className="grid-cards">
        {valoresFixos.map((valor, index) => (
          <div
            key={index}
            className={`card-doacao ${valorSelecionado === valor ? "selecionado" : ""}`}
            onClick={() => selecionarValor(valor)}
          >
            <h3>R$ {valor.toFixed(2)}</h3>

            {valorSelecionado === valor && (
              <div className="beneficios-extra expandido">
                <p><strong>Você escolheu doar:</strong> R$ {valor.toFixed(2)}</p>
                <p>Com isso, você ainda terá <strong>R$ {(valor * 2).toFixed(2)}</strong> em benefícios 💚</p>

                <div style={{ marginTop: "10px" }}>
                  <input
                    type="radio"
                    id={`unica-${index}`}
                    name="tipoDoacao"
                    value="Única"
                    checked={tipoDoacao === "Única"}
                    onChange={() => { setTipoDoacao("Única"); setMeses(null); }}
                  />
                  <label htmlFor={`unica-${index}`}>Única</label>

                  <input
                    type="radio"
                    id={`mensal-${index}`}
                    name="tipoDoacao"
                    value="Mensal"
                    checked={tipoDoacao === "Mensal"}
                    onChange={() => setTipoDoacao("Mensal")}
                  />
                  <label htmlFor={`mensal-${index}`}>Mensal</label>
                </div>

                {tipoDoacao === "Mensal" && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="radio"
                      id={`6meses-${index}`}
                      name="meses"
                      value={6}
                      checked={meses === 6}
                      onChange={() => setMeses(6)}
                    />
                    <label htmlFor={`6meses-${index}`}>6 meses</label>

                    <input
                      type="radio"
                      id={`12meses-${index}`}
                      name="meses"
                      value={12}
                      checked={meses === 12}
                      onChange={() => setMeses(12)}
                    />
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
          disabled={valorSelecionado === null || (tipoDoacao === "Mensal" && !meses)}
          onClick={finalizarDoacao}
        >
          Finalizar Doação
        </button>
      </div>
    </div>
  );
}
