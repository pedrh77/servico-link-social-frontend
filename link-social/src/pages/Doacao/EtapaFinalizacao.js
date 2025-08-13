import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EtapaFinalizacao.css";
import { NovaDoacao } from "../../Api";

export default function EtapaFinalizacao() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [ong, setOng] = useState(null);
  const [doacao, setDoacao] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    const ongSelecionada = JSON.parse(sessionStorage.getItem("ongSelecionada") || "null");
    const doacaoSelecionada = JSON.parse(sessionStorage.getItem("doacaoSelecionada") || "null");

    console.log("Usuário logado:", usuarioLogado);
    console.log("ONG selecionada:", ongSelecionada);
    console.log("Doação selecionada:", doacaoSelecionada);

    if (!usuarioLogado || !ongSelecionada || !doacaoSelecionada) {
      console.warn("Dados da doação incompletos. Retornando à seleção.");
      navigate("/etapa-selecao");
      return;
    }

    let tipoValido = doacaoSelecionada.tipo;
    let meses = doacaoSelecionada.meses || 12;

    if (!["Unica", "Mensal6x", "Mensal12x"].includes(tipoValido)) {
      console.warn("Tipo de doação inválido. Substituindo por 'Unica'");
      tipoValido = "Unica";
      meses = null;
    }

    setUsuario(usuarioLogado);
    setOng(ongSelecionada);
    setDoacao({ ...doacaoSelecionada, tipo: tipoValido, meses });
  }, [navigate]);

  const sair = () => {
    sessionStorage.removeItem("token");
    console.log("Usuário saiu, token removido.");
    navigate("/login");
  };

  const editarOng = () => {
    console.log("Editar ONG:", ong);
    navigate("/etapa-selecao");
  };

  const editarValor = () => {
    console.log("Editar valor da doação:", doacao);
    navigate("/etapa-valores");
  };

  const tipoDoacaoParaNumero = (tipo) => {
    switch (tipo) {
      case "Unica": return 1;
      case "Mensal6x": return 2;
      case "Mensal12x": return 3;
      default: return 1;
    }
  };

  const tipoDoacaoTexto = (tipo) => {
    switch (tipo) {
      case "Unica": return "Única";
      case "Mensal6x": return "Mensal - 6x";
      case "Mensal12x": return "Mensal - 12x";
      default: return tipo;
    }
  };

  const confirmarDoacao = async () => {
    console.log("Confirmando doação com os dados:", { usuario, ong, doacao });

    if (!usuario?.id || !ong?.id || !doacao?.beneficioId) {
      setStatus("Dados incompletos para a doação.");
      console.error("Dados incompletos:", { usuario, ong, doacao });
      return;
    }

    setLoading(true);
    setStatus("");
    setSucesso(false);

    try {
      const tipoEnumNumero = tipoDoacaoParaNumero(doacao.tipo);

      await NovaDoacao({
        DoadorId: usuario.id,
        OngId: ong.id,
        BeneficioId: doacao.beneficioId,
        Valor: parseFloat(doacao.valor),
        TipoDoacao: tipoEnumNumero,
        Comentario: "",
      });

      setStatus("Doação confirmada com sucesso!");
      setSucesso(true);
      console.log("Doação confirmada com sucesso!");
    } catch (err) {
      console.error("Erro ao confirmar a doação:", err);
      setStatus("Erro ao confirmar a doação. Tente novamente.");
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
          <button onClick={sair} className="minha-conta" style={{ cursor: "pointer" }}>
            Sair
          </button>
        </nav>
      </header>

      <main className="final-container">
        <h2 className="final-titulo">Resumo da Doação</h2>

        <div className="resumo-cards">
          <div className="card">
            <div className="logo-ong">{ong.nome || "Nome ONG"}</div>
            <button className="btn-editar" onClick={editarOng}>Editar</button>
          </div>

          <div className="card">
            <div className="valor">{`R$ ${doacao.valor}`}</div>
            <div className="tipo-doacao">{tipoDoacaoTexto(doacao.tipo)}</div>
            {doacao.tipo !== "Unica" && (
              <div className="meses">Duração: {doacao.meses} meses</div>
            )}
            <button className="btn-editar" onClick={editarValor}>Editar</button>
          </div>
        </div>

        {status && <div className="status-validando">{status}</div>}

        {!sucesso && (
          <button className="final-botao" onClick={confirmarDoacao} disabled={loading}>
            {loading ? <div className="spinner"></div> : "Confirmar Doação"}
          </button>
        )}

        {sucesso && (
          <div className="finalizacao-pagamento">
            <h3>Faça o pagamento através do QR Code abaixo</h3>
            <div className="qrcode-container">
              <img src="/img/qrcode-exemplo.png" alt="QR Code" className="finalizacao-qrcode" />
              <button
                className="btn-copiar"
                onClick={() => {
                  navigator.clipboard.writeText("link-pagamento");
                  console.log("Link de pagamento copiado!");
                }}
              >
                Copiar link
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
