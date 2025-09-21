import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./EtapaFinalizacao.css";
import { NovaDoacao } from "../../Api";
import Header from "../../Components/Header";

export default function EtapaFinalizacao() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [isParcela, setParcela] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [doacao, setDoacao] = useState(null);
  const [logado, setLogado] = useState(false);


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setLogado(!!token);
  }, []);


  useEffect(() => {
    const token = sessionStorage.getItem("token");

    try {
      if (logado && token) {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          sessionStorage.clear();
          setMensagemErro("Sua sessão expirou. Redirecionando para login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
      }
    } catch {
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
    const doacaoParcela = JSON.parse(sessionStorage.getItem("doacaoParcela") || "null");
    const doacaoSelecionada = JSON.parse(sessionStorage.getItem("doacaoSelecionada") || "null");
    const parcela = !!doacaoParcela;




    if (!usuarioLogado) {
      navigate("/login");
    }

    setUsuario(usuarioLogado);
    if (parcela) {
      setDoacao(doacaoParcela);
      setParcela(true);
    } else {
      setDoacao(doacaoSelecionada);
      setParcela(false);
    }

    console.log(doacao);
    console.log(isParcela);

  }, [navigate, logado]);

  const editarDoacao = () => navigate("/etapa-valores");
  const editarOng = () => navigate("/etapa-selecao");
  const getTipoDoacaoTexto = (tipo) => {
    console.log(tipo)
    switch (tipo) {
      case 0:
        return "Parcela";
      case 1:
        return "Única";
      case 2:
        return "Mensal (6x)";
      case 3:
        return "Mensal (12x)";
      default:
        return "Desconhecido";
    }
  };
  const confirmarDoacao = async () => {
    if (!usuario?.id || !doacao) {
      setMensagemErro("Dados incompletos para a doação.");
      return;
    }

    setLoading(true);
    setMensagemErro("");
    setSucesso(false);

    try {

      await NovaDoacao({
        DoadorId: doacao.doadorId,
        OngId: doacao.ongId,
        Valor: parseFloat(doacao.valor),
        TipoDoacao: doacao.tipoDoacao,
        Anonima: doacao.anonima || false,
        Comentario: doacao.anonima || !doacao.comentario ? null : doacao.comentario,
        PagamentoParcela: isParcela,
        PrimeiraDoacao: isParcela ? doacao.id : null,
      });

      setStatus("Doação registrada com sucesso!");
      setSucesso(true);
    } catch (err) {
      console.log(err);
      setMensagemErro("Erro ao confirmar a doação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario || !doacao) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <Header links={[{ label: "Inicio", path: "/Home" }, { label: "Meu Perfil", path: "/Usuario" }]} />

      <main className="final-container">
        <h2 className="final-titulo">Resumo da Doação</h2>
        <div className="resumo-cards">
          <div className="card">
            <div className="logo-ong">{doacao.nomeOng}</div>
            {(<p>{doacao.descricaoOng}</p>
            )}{!isParcela && (
              <button className="btn-editar" onClick={editarOng}>
                Editar
              </button>
            )}
          </div>

          <div className="card">
            <div className="valor">{`R$ ${doacao.valor}`}</div>
            <div className="tipo-doacao">{getTipoDoacaoTexto(doacao.tipoDoacao)}</div>




            {isParcela && (
              <div className="meses">
                Parcela {(doacao.numeroParcela ?? 0) + 1} de {doacao.totalParcelas}
              </div>
            )}

            {!isParcela && (
              <button className="btn-editar" onClick={editarDoacao}>
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="anonima-container">
          <label>Deseja que a doação seja anônima?</label>
          <div className="btn-group-anonima">
            <button
              className={doacao.anonima ? "btn-ativo" : ""}
              onClick={() => setDoacao({ ...doacao, anonima: true })}
            >
              Sim
            </button>
            <button
              className={!doacao.anonima ? "btn-ativo" : ""}
              onClick={() => setDoacao({ ...doacao, anonima: false })}
            >
              Não
            </button>
          </div>
        </div>

        {!doacao.anonima && (
          <>
            <label htmlFor="comentario">Mensagem (opcional)</label>
            <div className="comentario-container">
              <textarea
                id="comentario"
                className="comentario-textarea"
                value={doacao.comentario || ""}
                onChange={(e) => setDoacao({ ...doacao, comentario: e.target.value })}
                placeholder="Escreva uma mensagem para a ONG..."
                rows={4}
              />
            </div>
          </>
        )}

        {mensagemErro && <div className="status-erro">{mensagemErro}</div>}

        {sucesso && (
          <div className="finalizacao-bloco">
            <div className="finalizacao-sucesso">
              <h3>🎉 {status}</h3>
              <p>
                Obrigado por apoiar a ONG <strong>{doacao.nomeOng}</strong>.
              </p>
              <p className="info-pagamento">
                No momento ainda não temos meios de pagamento integrados.
                <br />
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
