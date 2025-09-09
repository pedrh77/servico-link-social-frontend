import React, { useState, useEffect } from "react";
import { getUsuarioAutenticado } from "../../Api";
import DoadorUsuario from "../../Components/DoadorUsuario.js";
import EmpresaUsuario from "../../Components/EmpresaUsuario";
import OngUsuario from "../../Components/OngUsuario";
import "./Usuario.css";

export default function Usuario() {
  const [dados, setDados] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuario = await getUsuarioAutenticado();
        setDados(usuario);
        setTipoUsuario(usuario.tipoUsuario);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

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
