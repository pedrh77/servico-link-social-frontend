import React, { useState, useEffect } from "react";
import { getUsuarioAutenticado } from "../../Api";
import "./Usuario.css";

export default function Usuario() {
  const assinaturasExemplo = [
    { id: 1, valor: "R$ 10,00", tipo: "Mensal", status: "Ativa", ong: "ONG Exemplo" },
    { id: 2, valor: "R$ 5,00", tipo: "Única", status: "Finalizada", ong: "ONG Alegria" },
  ];

  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [dados, setDados] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuario = await getUsuarioAutenticado();
        setDados(usuario);
        setTipoUsuario(usuario.tipoUsuario);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function handleSalvar() {
    setEditando(false);
    alert("Dados salvos com sucesso!");
  }

  function handleCancelar() {
    setEditando(false);
  }

  function handleDoar() {
    window.location.href = "/doar";
  }

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>{error}</p>;
  if (!dados) return <p>Dados do usuário não disponíveis</p>;

  return (
    <div className="usuario-container">
      <h2 className="usuario-titulo manjari-bold">Minha Conta</h2>

      <section className="usuario-dados">
        <h3 className="section-title">Dados Pessoais</h3>
        <form
          className="form-dados"
          onSubmit={(e) => {
            e.preventDefault();
            handleSalvar();
          }}
        >
          <label>
            Nome Completo:
            <input
              name="nome"
              value={dados.nome}
              disabled={!editando}
              onChange={handleChange}
              className={`input-dados ${editando ? "input-editando" : ""}`}
              required
            />
          </label>

          <label>
            E-mail:
            <input
              name="email"
              type="email"
              value={dados.email}
              disabled={!editando}
              onChange={handleChange}
              className={`input-dados ${editando ? "input-editando" : ""}`}
              required
            />
          </label>

          <label>
            Telefone:
            <input
              name="telefone"
              value={dados.telefone}
              disabled={!editando}
              onChange={handleChange}
              className={`input-dados ${editando ? "input-editando" : ""}`}
              required
            />
          </label>

          {tipoUsuario === 0 && (
            <label>
              CPF:
              <input
                name="cpf"
                value={dados.cpf ?? ""}
                disabled={!editando}
                onChange={handleChange}
                className={`input-dados ${editando ? "input-editando" : ""}`}
                required={tipoUsuario === 0}
              />
            </label>
          )}

          {tipoUsuario === 1 && (
            <label>
              CNPJ:
              <input
                name="cnpj"
                value={dados.cnpj ?? ""}
                disabled={!editando}
                onChange={handleChange}
                className={`input-dados ${editando ? "input-editando" : ""}`}
                required={tipoUsuario === 1}
              />
            </label>
          )}

          {!editando ? (
            <button
              type="button"
              className="btn-editar"
              onClick={() => setEditando(true)}
            >
              Editar Dados
            </button>
          ) : (
            <div className="botoes-salvar-cancelar">
              <button type="submit" className="btn-salvar">
                Salvar
              </button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          )}
        </form>
      </section>

      {tipoUsuario === 0 && (
        <section className="usuario-doar" style={{ marginTop: "1rem" }}>
          <button className="btn-doar" onClick={handleDoar}>
            Doar Agora
          </button>
        </section>
      )}
      <section className="usuario-assinaturas">
        <h3 className="section-title">Minhas Assinaturas</h3>
        {assinaturasExemplo.length === 0 ? (
          <p>Você ainda não possui assinaturas.</p>
        ) : (
          <ul className="lista-assinaturas">
            {assinaturasExemplo.map((a) => (
              <li key={a.id} className="card-assinatura">
                <div className="assinatura-header">
                  <strong>{a.valor}</strong> - <span className="tipo-assinatura">{a.tipo}</span>
                </div>
                <div className="assinatura-status">
                  <span className={`status ${a.status === "Ativa" ? "status-ativa" : "status-finalizada"}`}>
                    {a.status === "Ativa" ? "✔️ Ativa" : "⏳ Finalizada"}
                  </span>
                </div>
                <div className="assinatura-ong">
                  ONG: <strong>{a.ong}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}