import React, { useState, useEffect } from "react";
import { getUsuarioAutenticado } from "../../Api";
import DoadorUsuario from "./DoadorUsuario";
import OngUsuario from "./OngUsuario";
import EmpresaUsuario from "./EmpresaUsuario";
import Header from "../../Components/Header.js";
import "./Usuario.css";

export default function Usuario() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    async function carregarUsuario() {
      try {
        const usuario = await getUsuarioAutenticado();
        if (!cancelado) {
          setDados(usuario);
          sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        }
      } catch (err) {
        if (!cancelado) setError(err.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    carregarUsuario();
    return () => { cancelado = true; };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!dados) return <p>Dados do usuário não disponíveis</p>;

  return (
    <div className="usuario-page">
      <Header usuario={dados} onLogout={handleLogout} />

      <div className="usuario-container">
        
        {dados.tipoUsuario === 0 && <DoadorUsuario dados={dados} />}
        {dados.tipoUsuario === 1 && <OngUsuario dados={dados} />}
        {dados.tipoUsuario === 2 && <EmpresaUsuario dados={dados} />}
      </div>
    </div>
  );
}
