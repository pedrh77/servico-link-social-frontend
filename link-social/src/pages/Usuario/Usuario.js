import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./Usuario.css";

const assinaturasExemplo = [
  { id: 1, valor: "R$ 10,00", tipo: "Mensal", status: "Ativa", ong: "ONG Exemplo" },
  { id: 2, valor: "R$ 5,00", tipo: "Única", status: "Finalizada", ong: "ONG Alegria" },
];

export default function Usuario() {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        setTipoUsuario(decoded.tipoUsuario);
      } catch (error) {
        console.error("Token inválido", error);
      }
    }
  }, []);

  const [dados, setDados] = useState({
    nome: "João da Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123, São Paulo - SP",
  });
  const [editando, setEditando] = useState(false);

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function handleSalvar() {
    setEditando(false);
    // Aqui você pode fazer integração com a API para salvar os dados
    alert("Dados salvos com sucesso!");
  }

  function handleCancelar() {
    setEditando(false);
  }

  function handleDoar() {
    window.location.href = "/doar"; // Ajuste a rota para a página de doação que você usar
  }

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

          <label>
            Endereço:
            <input
              name="endereco"
              value={dados.endereco}
              disabled={!editando}
              onChange={handleChange}
              className={`input-dados ${editando ? "input-editando" : ""}`}
              placeholder="Informe seu endereço completo"
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
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Botão doar só para doadores (tipoUsuario === 0) */}
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