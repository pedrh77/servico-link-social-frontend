import React, { useState } from "react";
import "./Usuario.css";
const assinaturasExemplo = [
  { id: 1, valor: "R$ 10,00", tipo: "Mensal", status: "Ativa", ong: "ONG Exemplo" },
  { id: 2, valor: "R$ 5,00", tipo: "Única", status: "Finalizada", ong: "ONG Alegria" },
];

export default function Usuario() {
  const [dados, setDados] = useState({
    nome: "João da Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
  });
  const [editando, setEditando] = useState(false);

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function handleSalvar() {
    setEditando(false);
    // Aqui você pode integrar com a API para salvar os dados
  }

  return (
    <div className="usuario-container">
      <h2 className="usuario-titulo">Minha Conta</h2>

      <section className="usuario-dados">
        <h3>Dados do Usuário</h3>
        <form className="form-dados" onSubmit={e => { e.preventDefault(); handleSalvar(); }}>
          <label>
            Nome:
            <input
              name="nome"
              value={dados.nome}
              disabled={!editando}
              onChange={handleChange}
              className="input-dados"
              required
            />
          </label>

          <label>
            Email:
            <input
              name="email"
              type="email"
              value={dados.email}
              disabled={!editando}
              onChange={handleChange}
              className="input-dados"
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
              className="input-dados"
              required
            />
          </label>

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
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </section>

      <section className="usuario-assinaturas">
        <h3>Minhas Assinaturas</h3>
        <ul className="lista-assinaturas">
          {assinaturasExemplo.map((a) => (
            <li key={a.id} className="card-assinatura">
              <strong>{a.valor}</strong> - {a.tipo}
              <br />
              <span className={a.status === "Ativa" ? "status-ativa" : "status-finalizada"}>
                {a.status}
              </span>
              <br />
              <span className="ong-nome">ONG: {a.ong}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
