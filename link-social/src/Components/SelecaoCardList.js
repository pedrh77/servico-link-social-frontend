import React, { useEffect, useState } from "react";
import Header from "./Header.js";


export default function SelecaoCardList({
  titulo,
  fetchData,
  storageKey,
  nextRoute,
  links = [{ label: "Inicio", path: "/Home" }],
}) {
  const [usuario, setUsuario] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    setUsuario(usuarioLogado);

    async function fetchDados() {
      try {
        const data = await fetchData();
        setItens(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, [fetchData]);

  function handleEscolher(item) {
    setSelecionado(item);
  }

  function handleAvancar() {
    if (!selecionado) {
      alert("Por favor, selecione um item antes de avançar.");
      return;
    }
    sessionStorage.setItem(storageKey, JSON.stringify(selecionado));
    window.location.href = nextRoute;
  }

  return (
    <div className="container" role="main">
      <Header links={links} />

      <h1 className="titulo">{titulo}</h1>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : (
        <div className="grid-ongs">
          {itens.map((item) => (
            <div
              key={item.id}
              className={`card-ong ${selecionado?.id === item.id ? "selecionada" : ""
                }`}
              tabIndex={0}
            >
              <div className="info-ong">
                <h3>{item.nome}</h3>
                <div className="tag">
                  {item.comentario == null ? (
                    <p>Sem descrição</p>
                  ) : (
                    <p>{item.comentario}</p>
                  )}
                </div>
                <button
                  className="btn-escolher"
                  onClick={() => handleEscolher(item)}
                  aria-label={`Escolher ${item.nome}`}
                >
                  {selecionado?.id === item.id ? "Selecionada" : "Escolher"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
