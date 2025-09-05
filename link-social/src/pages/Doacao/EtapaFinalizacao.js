import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./EtapaFinalizacao.css";
import { NovaDoacao } from "../../Api";

export default function EtapaFinalizacao() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [ong, setOng] = useState(null);
  const [doacao, setDoacao] = useState(null);

  useEffect(() => {
    let cancelado = false;
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        sessionStorage.clear();
        setMensagemErro("Sua sessão expirou. Redirecionando para login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
    } catch (err) {
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada") || "null");
    const doacaoSelecionada = JSON.parse(sessionStorage.getItem("doacaoSelecionada") || "null");

    if (!usuarioLogado || !ongSelecionada || !doacaoSelecionada) {
      navigate("/etapa-selecao");
      return;
    }

    if (!cancelado) {
      setUsuario(usuarioLogado);
      setOng(ongSelecionada);
      setDoacao(doacaoSelecionada);
    }
    return () => { cancelado = true; };
  }, [navigate]);

  const sair = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const editarOng = () => navigate("/etapa-selecao");
  const editarValor = () => navigate("/etapa-valores");


  const tipoDoacaoParaNumero = (tipo, meses) => {
    if (tipo === "Unica") return 1;
    if (tipo === "Mensal" && meses === 6) return 2;
    if (tipo === "Mensal" && meses === 12) return 3;
    return 1;
  };

  const tipoDoacaoTexto = (tipo, meses) => {
    if (tipo === "Unica") return "Única";
    if (tipo === "Mensal" && meses === 6) return "Mensal";
    if (tipo === "Mensal" && meses === 12) return "Mensal - 12x";
    return "Única";
  };

  const confirmarDoacao = async () => {
    if (!usuario?.id || !ong?.id || !doacao?.beneficioId) {
      setMensagemErro("Dados incompletos para a doação.");
      return;
    }

    setLoading(true);
    setMensagemErro("");
    setSucesso(false);

    try {
      await NovaDoacao({
        DoadorId: usuario.id,
        OngId: ong.id,
        BeneficioId: doacao.beneficioId,
        Valor: parseFloat(doacao.valor),
        TipoDoacao: tipoDoacaoParaNumero(doacao.tipo, doacao.meses),
        Comentario: "",
      });

      setStatus("Doação registrada com sucesso!");
      setSucesso(true);

      setTimeout(() => navigate("/usuario"), 5000);
    } catch (err) {
      setMensagemErro("Erro ao confirmar a doação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario || !ong || !doacao) return <div className="loading">Carregando...</div>;

  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        </div>
        <nav className="nav-header">
          <button onClick={sair} className="logout">Sair</button>
        </nav>
      </header>

      <main className="final-container">
        <h2 className="final-titulo">Resumo da Doação</h2>

        <div className="resumo-cards">
          <div className="card">
            <div className="logo-ong">{ong.nome}</div>
            <button className="btn-editar" onClick={editarOng}>Editar</button>
          </div>

          <div className="card">
            <div className="valor">{`R$ ${doacao.valor}`}</div>
            <div className="tipo-doacao">
              {doacao.tipo}
            </div>
            {doacao.tipo === "Mensal" && (
              <div className="meses">Duração: {doacao.meses} meses</div>
            )}
            <button className="btn-editar" onClick={editarValor}>Editar</button>
          </div>
        </div>

        {mensagemErro && <div className="status-erro">{mensagemErro}</div>}

        {sucesso && (
          <div className="finalizacao-bloco">
            <div className="finalizacao-sucesso">
              <h3>🎉 {status}</h3>
              <p>Obrigado por apoiar a ONG <strong>{ong.nome}</strong>.</p>
              <p className="info-pagamento">
                No momento ainda não temos meios de pagamento integrados.<br />
                Você será redirecionado em instantes...
              </p>
            </div>

            <div className="finalizacao-pagamento">
              <h3>Faça o pagamento através do QR Code abaixo</h3>
              <div className="qrcode-container">
                <img src="/img/qrcode-exemplo.png" alt="QR Code" className="finalizacao-qrcode" />
                <button
                  className="btn-copiar"
                  onClick={() => navigator.clipboard.writeText("link-pagamento")}
                >
                  Copiar link
                </button>
              </div>
            </div>
          </div>
        )}

        {!sucesso && !loading && (
          <button className="btn-confirmar" onClick={confirmarDoacao}>
            Confirmar Doação
          </button>
        )}

        {loading && <div className="status-validando">Processando doação...</div>}
      </main>
    </div>
  );
}
