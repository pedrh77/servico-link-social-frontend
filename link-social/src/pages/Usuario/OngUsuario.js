import React, { useState } from "react";
import Accordion from "../../Components/Accordion";

export default function OngUsuario({ dados }) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    endereco: dados.endereco,
    descricao: dados.descricao,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = () => {
    console.log("Salvar alterações ONG:", formData);
    setEditando(false);
  };

  return (
    <div className="usuario-container">
      <Accordion title="Meus Dados" defaultOpen>
        <form className="form-dados">
          <label>Nome da ONG</label>
          <input
            type="text"
            name="nome"
            className={`input-dados ${editando ? "input-editando" : ""}`}
            value={formData.nome}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            className={`input-dados ${editando ? "input-editando" : ""}`}
            value={formData.email}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            className={`input-dados ${editando ? "input-editando" : ""}`}
            value={formData.telefone}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Endereço</label>
          <input
            type="text"
            name="endereco"
            className={`input-dados ${editando ? "input-editando" : ""}`}
            value={formData.endereco}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Descrição</label>
          <textarea
            name="descricao"
            className={`textarea-beneficio ${editando ? "input-editando" : ""}`}
            value={formData.descricao}
            onChange={handleChange}
            disabled={!editando}
          />

          {editando ? (
            <div className="botoes-salvar-cancelar">
              <button type="button" className="btn-salvar" onClick={salvarAlteracoes}>
                Salvar
              </button>
              <button type="button" className="btn-cancelar" onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" className="btn-editar" onClick={() => setEditando(true)}>
              Editar
            </button>
          )}
        </form>
      </Accordion>

      {/* Doações Recebidas */}
      <Accordion title="Doações Recebidas">
        <div className="lista-doacoes-container">
          <ul className="lista-doacoes-compacta">
            {dados.doacoes?.length > 0 ? (
              dados.doacoes.map((doacao) => (
                <li key={doacao.id} className="card-doacao ong">
                  <div className="doacao-summary">
                    <p><strong>Doador:</strong> {doacao.doador}</p>
                    <p><strong>Valor:</strong> R$ {doacao.valor}</p>
                    <span className={`status-${doacao.status.toLowerCase()}`}>
                      {doacao.status}
                    </span>
                    <span className="expand-icon">+</span>
                  </div>
                  <div className="doacao-detalhes">
                    <p><strong>Data:</strong> {doacao.data}</p>
                    {doacao.comentario && (
                      <p className="comentario">{doacao.comentario}</p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>Nenhuma doação recebida ainda.</p>
            )}
          </ul>
        </div>
      </Accordion>

      {/* Benefícios Disponíveis */}
      <Accordion title="Benefícios Disponíveis">
        <div className="lista-beneficios-container">
          <ul className="lista-beneficios">
            {dados.beneficios?.length > 0 ? (
              dados.beneficios.map((beneficio) => (
                <li key={beneficio.id} className="card-beneficio empresa">
                  <p><strong>{beneficio.titulo}</strong></p>
                  <p>{beneficio.descricao}</p>
                </li>
              ))
            ) : (
              <p>Nenhum benefício disponível no momento.</p>
            )}
          </ul>
        </div>
      </Accordion>
    </div>
  );
}
