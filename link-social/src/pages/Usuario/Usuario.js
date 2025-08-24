import React, { useState, useEffect } from "react";
import {
  getUsuarioAutenticado,
  getBeneficiosPorOngId,
  GetDoacoesByDoadorId,
  GetDoacoesByOngId,
  criarBeneficio as apiCriarBeneficio,
} from "../../Api";
import "./Usuario.css";

export default function Usuario() {
  // Estados principais
  const [dados, setDados] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null); // 0 = Doador, 1 = ONG, 2 = Empresa
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

  // --------- EFEITO: Carrega usuário autenticado ---------
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

  // --------- EFEITO: Carrega benefícios se for empresa ---------
  useEffect(() => {
    let ativo = true;
    async function carregarBeneficios() {
      if (tipoUsuario === 2 && dados?.id) {
        try {
          const lista = await getBeneficiosPorOngId(dados.id);
          if (ativo) setBeneficios(lista);
        } catch (err) {
          console.error("Erro ao carregar benefícios:", err);
        }
      }
    }
    carregarBeneficios();
    return () => (ativo = false);
  }, [tipoUsuario, dados?.id]);

  // --------- Funções auxiliares ---------
  const handleChange = (e) => setDados({ ...dados, [e.target.name]: e.target.value });

  const handleSalvar = () => {
    setEditando(false);
    alert("Dados salvos com sucesso!");
  };

  const handleCancelar = () => setEditando(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setLogado(false);
    window.location.href = "/login";
  };

  const criarNovoBeneficio = async () => {
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

      const response = await apiCriarBeneficio(novoBeneficio);
      if (!response.ok) throw new Error("Falha ao criar benefício");

      const listaAtualizada = await getBeneficiosPorOngId(dados.id);
      setBeneficios(listaAtualizada);

      setDescricaoBeneficio("");
      setValorBeneficio("");
      alert("Benefício criado com sucesso!");
    } catch (err) {
      alert("Erro ao criar benefício: " + err.message);
    }
  };

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

  const tipoDoacaoTexto = (tipo) => ({ 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" }[tipo] || "Desconhecido");

  const statusTexto = (status) => ({ 0: "Pendente", 1: "Pago", 2: "Cancelado" }[status] ?? "Desconhecido");

  // --------- Loading/Error ---------
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

          <button className="hamburger" id="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
            ☰
          </button>

          <nav className={`nav ${menuAberto ? "show" : ""}`} id="nav-menu">
            {logado ? (
              <button className="logout" onClick={handleLogout}>Sair</button>
            ) : (
              <>
                <a href="/login" className="login">Entrar</a>
                <button className="signup" onClick={() => (window.location.href = "/register")}>Cadastrar</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="usuario-container">
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
              onSubmit={(e) => { e.preventDefault(); handleSalvar(); }}
            >
              <label>
                Nome Completo:
                <input name="nome" value={dados.nome ?? ""} disabled={!editando} onChange={handleChange} required />
              </label>
              <label>
                E-mail:
                <input name="email" type="email" value={dados.email ?? ""} disabled={!editando} onChange={handleChange} required />
              </label>
              <label>
                Telefone:
                <input name="telefone" value={dados.telefone ?? ""} disabled={!editando} onChange={handleChange} required />
              </label>
              {tipoUsuario === 0 ? (
                <label>CPF: <input name="cpf" value={dados.cpf ?? ""} disabled={!editando} onChange={handleChange} required /></label>
              ) : (
                <label>CNPJ: <input name="cnpj" value={dados.cnpj ?? ""} disabled={!editando} onChange={handleChange} required /></label>
              )}
              {!editando ? (
                <button type="button" onClick={() => setEditando(true)}>Editar Dados</button>
              ) : (
                <div className="botoes-salvar-cancelar">
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={handleCancelar}>Cancelar</button>
                </div>
              )}
            </form>
          )}
        </section>

        {tipoUsuario === 0 && (
          <section className="accordion-section">
            <button className="accordion-header" type="button" aria-expanded={true}>
              Minhas Doações
            </button>
            <div className="lista-doacoes-container">
              {doacoes.length === 0 ? <p>Você ainda não possui doações.</p> : (
                <ul className="lista-doacoes">
                  {doacoes.map((d) => (
                    <li key={d.id}>
                      <p>ONG: {d.nomeOng ?? "Desconhecida"}</p>
                      <p>Benefício: {d.descricaoBeneficio ?? "-"}</p>
                      <p>Valor: R$ {(d.valor ?? 0).toFixed(2)}</p>
                      <p>Tipo: {tipoDoacaoTexto(d.tipoDoacao)}</p>
                      <p>Status: {statusTexto(d.statusPagamento)}</p>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => (window.location.href = "/etapa-selecao")}>Nova Doação</button>
            </div>
          </section>
        )}

        {tipoUsuario === 1 && (
          <section className="accordion-section">
            <button className="accordion-header" type="button" aria-expanded={true}>
              Doações Recebidas
            </button>
            <div className="lista-doacoes-container">
              {doacoes.length === 0 ? <p>Sua ONG ainda não recebeu doações.</p> : (
                <ul className="lista-doacoes">
                  {doacoes.map((d) => (
                    <li key={d.id}>
                      <p>Doador: {d.nomeDoador ?? "Anônimo"}</p>
                      <p>Benefício: {d.descricaoBeneficio ?? "-"}</p>
                      <p>Valor: R$ {(d.valor ?? 0).toFixed(2)}</p>
                      <p>Tipo: {tipoDoacaoTexto(d.tipoDoacao)}</p>
                      <p>Status: {statusTexto(d.statusPagamento)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {tipoUsuario === 2 && (
          <>
            <section className="accordion-section">
              <button className="accordion-header" onClick={() => toggleSection("cadastroBeneficios")}>
                Cadastro de Benefícios
                <span>{showCadastroBeneficios ? "-" : "+"}</span>
              </button>
              {showCadastroBeneficios && (
                <form onSubmit={(e) => { e.preventDefault(); criarNovoBeneficio(); }}>
                  <label>
                    Descrição:
                    <textarea value={descricaoBeneficio} onChange={(e) => setDescricaoBeneficio(e.target.value)} rows="4" required />
                  </label>
                  <label>Valor:</label>
                  <div>
                    {[5, 10, 20, 50].map((v) => (
                      <button key={v} type="button" className={valorBeneficio == v ? "selecionado" : ""} onClick={() => setValorBeneficio(v)}>R$ {v}</button>
                    ))}
                  </div>
                  <button type="submit">Criar Benefício</button>
                </form>
              )}
            </section>

            <section className="accordion-section">
              <button className="accordion-header" onClick={() => toggleSection("beneficiosAtivos")}>
                Benefícios Ativos
                <span>{showBeneficiosAtivos ? "-" : "+"}</span>
              </button>
              {showBeneficiosAtivos && (
                <div>
                  {beneficios.length === 0 ? <p>Você ainda não possui benefícios cadastrados.</p> : (
                    <ul>
                      {beneficios.map((b) => (
                        <li key={b.id}>
                          <p>{b.descricao}</p>
                          <p>R$ {b.valor.toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
