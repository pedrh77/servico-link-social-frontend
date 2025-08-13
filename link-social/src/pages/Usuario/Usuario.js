import React, { useState, useEffect } from "react";
import { getUsuarioAutenticado, getBeneficiosPorOngId, GetDoacoesByDoadorId } from "../../Api";
import "./Usuario.css";

export default function Usuario() {
  const [dados, setDados] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [beneficios, setBeneficios] = useState([]);
  const [descricaoBeneficio, setDescricaoBeneficio] = useState("");
  const [valorBeneficio, setValorBeneficio] = useState("");
  const [showEditarDados, setShowEditarDados] = useState(true);
  const [showCadastroBeneficios, setShowCadastroBeneficios] = useState(false);
  const [showBeneficiosAtivos, setShowBeneficiosAtivos] = useState(false);
  const [logado, setLogado] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuario = await getUsuarioAutenticado();
        setDados(usuario);
        setTipoUsuario(usuario.tipoUsuario);
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  useEffect(() => {
    async function carregarDoacoes() {
      if (tipoUsuario === 0 && dados?.id) {
        try {
          const doacoesData = await GetDoacoesByDoadorId(dados.id);
          setDoacoes(doacoesData);
        } catch (error) {
          console.error("Erro ao carregar doações:", error);
          setDoacoes([]);
        }
      }
    }
    carregarDoacoes();
  }, [tipoUsuario, dados?.id]);

  useEffect(() => {
    let ativo = true;
    async function carregarBeneficios() {
      if (tipoUsuario === 1 && dados?.id) {
        try {
          const lista = await getBeneficiosPorOngId(dados.id);
          if (ativo) setBeneficios(lista);
        } catch (error) {
          console.error("Erro ao carregar benefícios:", error);
        }
      }
    }
    carregarBeneficios();
    return () => {
      ativo = false;
    };
  }, [tipoUsuario, dados?.id]);

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

  function handleLogout() {
    sessionStorage.removeItem("token");
    setLogado(false);
    window.location.href = "/login";
  }

  async function criarBeneficio() {
    if (!descricaoBeneficio.trim() || !valorBeneficio) {
      alert("Preencha descrição e valor do benefício.");
      return;
    }
    try {
      const novoBeneficio = {
        UsuarioId: dados.id,
        Descricao: descricaoBeneficio,
        Valor: parseFloat(valorBeneficio),
      };

      const token = sessionStorage.getItem("token");
      const response = await fetch("https://localhost:7148/api/Beneficios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoBeneficio),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar benefício");
      }

      const listaAtualizada = await getBeneficiosPorOngId(dados.id);
      setBeneficios(listaAtualizada);

      setDescricaoBeneficio("");
      setValorBeneficio("");
      alert("Benefício criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar benefício: " + error.message);
    }
  }

  const toggleSection = (section) => {
    switch (section) {
      case "editarDados":
        setShowEditarDados(!showEditarDados);
        break;
      case "cadastroBeneficios":
        setShowCadastroBeneficios(!showCadastroBeneficios);
        break;
      case "beneficiosAtivos":
        setShowBeneficiosAtivos(!showBeneficiosAtivos);
        break;
      default:
        break;
    }
  };

  const tipoDoacaoTexto = (tipo) => {
    const mapa = { 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" };
    return mapa[tipo] || "Desconhecido";
  };

  const statusTexto = (status) => {
    const mapa = { 0: "Pendente", 1: "Pago", 2: "Cancelado" };
    return mapa[status] ?? "Desconhecido";
  };

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!dados) return <p>Dados do usuário não disponíveis</p>;

  return (
    <div className="usuario-page">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/img/logo-link.svg" alt="Logo" className="logo" />
          </div>

          <button
            className="hamburger"
            id="menu-toggle"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            ☰
          </button>

          <nav className={`nav ${menuAberto ? "show" : ""}`} id="nav-menu">
            {logado ? (
              <button className="logout-button" onClick={handleLogout}>
                Sair
              </button>
            ) : (
              <>
                <a href="/login" className="login">Entrar</a>
                <button className="signup" onClick={() => (window.location.href = "/register")}>
                  Cadastrar
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="usuario-container">
        {/* Editar Dados */}
        <section className="accordion-section">
          <button
            className="accordion-header"
            onClick={() => toggleSection("editarDados")}
            type="button"
            aria-expanded={showEditarDados}
            aria-controls="editarDados-content"
          >
            Editar Dados
            <span className="accordion-icon">{showEditarDados ? "-" : "+"}</span>
          </button>
          {showEditarDados && (
            <form
              id="editarDados-content"
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
                  value={dados.nome ?? ""}
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
                  value={dados.email ?? ""}
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
                  value={dados.telefone ?? ""}
                  disabled={!editando}
                  onChange={handleChange}
                  className={`input-dados ${editando ? "input-editando" : ""}`}
                  required
                />
              </label>
              {tipoUsuario === 0 ? (
                <label>
                  CPF:
                  <input
                    name="cpf"
                    value={dados.cpf ?? ""}
                    disabled={!editando}
                    onChange={handleChange}
                    className={`input-dados ${editando ? "input-editando" : ""}`}
                    required
                  />
                </label>
              ) : (
                <label>
                  CNPJ:
                  <input
                    name="cnpj"
                    value={dados.cnpj ?? ""}
                    disabled={!editando}
                    onChange={handleChange}
                    className={`input-dados ${editando ? "input-editando" : ""}`}
                    required
                  />
                </label>
              )}

              {!editando ? (
                <button type="button" className="btn-editar" onClick={() => setEditando(true)}>
                  Editar Dados
                </button>
              ) : (
                <div className="botoes-salvar-cancelar">
                  <button type="submit" className="btn-salvar">Salvar</button>
                  <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          )}
        </section>

        {/* Benefícios ONG */}
        {tipoUsuario === 1 && (
          <section className="accordion-section">
            <button
              className="accordion-header"
              onClick={() => toggleSection("cadastroBeneficios")}
              type="button"
              aria-expanded={showCadastroBeneficios}
              aria-controls="cadastroBeneficios-content"
            >
              Cadastro Benefícios
              <span className="accordion-icon">{showCadastroBeneficios ? "-" : "+"}</span>
            </button>
            {showCadastroBeneficios && (
              <form
                id="cadastroBeneficios-content"
                onSubmit={(e) => {
                  e.preventDefault();
                  criarBeneficio();
                }}
                className="form-beneficio"
              >
                <label>
                  Descrição:
                  <input
                    type="text"
                    value={descricaoBeneficio}
                    onChange={(e) => setDescricaoBeneficio(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Valor:
                  <input
                    type="number"
                    step="0.01"
                    value={valorBeneficio}
                    onChange={(e) => setValorBeneficio(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="btn-criar-beneficio">
                  Criar Benefício
                </button>
              </form>
            )}
          </section>
        )}

        {/* Histórico de Doações */}
        {tipoUsuario === 0 && (
          <section className="accordion-section">
            <button
              className="accordion-header"
              type="button"
              aria-expanded={true}
              aria-controls="doacoes-content"
            >
              Doações em andamento
            </button>
            <div id="doacoes-content" className="lista-doacoes-container">
              {doacoes.length === 0 ? (
                <p>Você ainda não possui doações em andamento.</p>
              ) : (
                <ul className="lista-doacoes">
                  {doacoes.map((d) => (
                    <li key={d.id} className="card-doacao">
                      <div className="doacao-ong">ONG: {d.nomeOng ?? "Desconhecida"}</div>
                      <div className="doacao-beneficio">Benefício: {d.descricaoBeneficio ?? "-"}</div>
                      <div className="doacao-valor">Valor: R$ {(d.valor ?? 0).toFixed(2)}</div>
                      <div className="doacao-tipo">Tipo: {tipoDoacaoTexto(d.tipoDoacao)}</div>
                      <div className="doacao-status">Status: {statusTexto(d.statusPagamento)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="btn-nova-doacao"
                onClick={() => (window.location.href = "/etapa-selecao")}
              >
                Nova Doação
              </button>
            </div>
          </section>
        )}

        {/* Benefícios Ativos ONG */}
        {tipoUsuario === 1 && (
          <section className="accordion-section">
            <button
              className="accordion-header"
              onClick={() => toggleSection("beneficiosAtivos")}
              type="button"
              aria-expanded={showBeneficiosAtivos}
              aria-controls="beneficiosAtivos-content"
            >
              Benefícios Ativos
              <span className="accordion-icon">{showBeneficiosAtivos ? "-" : "+"}</span>
            </button>
            {showBeneficiosAtivos && (
              <div id="beneficiosAtivos-content" className="lista-beneficios-container">
                {beneficios.length === 0 ? (
                  <p>Você ainda não possui benefícios cadastrados.</p>
                ) : (
                  <ul className="lista-beneficios">
                    {beneficios.map((b) => (
                      <li key={b.id} className="card-beneficio">
                        <div className="beneficio-descricao">{b.descricao}</div>
                        <div className="beneficio-valor">R$ {b.valor.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
