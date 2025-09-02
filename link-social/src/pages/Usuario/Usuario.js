import React, { useState, useEffect } from "react";
import { getUsuarioAutenticado } from "../../Api";
import DoadorUsuario from "./DoadorUsuario.js";
import OngUsuario from "./OngUsuario.js";
import EmpresaUsuario from "./EmpresaUsuario.js";
import "./Usuario.css";

export default function Usuario() {
  const [dados, setDados] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logado, setLogado] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuario = await getUsuarioAutenticado();
        setDados(usuario);
        setTipoUsuario(usuario.tipoUsuario);
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setLogado(false);
    window.location.href = "/login";
  };

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!dados) return <p>Dados do usuário não disponíveis</p>;

  return (
   
      <div className="usuario-container">
        {tipoUsuario === 0 && <DoadorUsuario dados={dados} />}
        {tipoUsuario === 1 && <OngUsuario dados={dados} />}
        {tipoUsuario === 2 && <EmpresaUsuario dados={dados} />}
      </div>
  );
}
