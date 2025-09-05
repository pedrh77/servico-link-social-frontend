import React, { useEffect, useState } from "react";
import "./EtapaEscolha.css";
import { getOngs } from "../../Api.js";
import Header from "../../Components/Header.js";

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

  const links = [
    { label: "Inicio", path: "/Home" }
  ];

  return (
    <div className="container" role="main">
      <Header links={links} />

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