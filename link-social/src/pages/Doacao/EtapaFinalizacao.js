import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EtapaFinalizacao.css";

export default function EtapaFinalizacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ong, valor, tipo, meses } = location.state || {};

  const editarOng = () => navigate("/etapa-escolha");
  const editarValor = () => navigate("/etapa-valores");

  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        </div>
        <nav className="nav-header">
          <a href="/usuario" className="minha-conta">Minha Conta</a>
        </nav>
      </header>

      <main className="final-container">
        <h2 className="final-titulo">Resumo Doação</h2>
        <div className="resumo-cards">
          <div className="card">
            <div className="logo-ong">{ong || "Nome ONG"}</div>
            <button className="btn-editar" onClick={editarOng}>Editar</button>
          </div>
          <div className="card">
            <div className="valor">{`R$ ${valor}` || "R$ 50,00"}</div>
            <button className="btn-editar" onClick={editarValor}>Editar</button>
            <div className="mensal">{tipo || "Mensal"}</div>
            <div className="meses">{meses ? `${meses} Meses` : "12 Meses"}</div>
          </div>
        </div>

        <div className="finalizacao-pagamento">
          <h3>Faça o pagamento através do QrCode abaixo</h3>
          <div className="qrcode-container">
            <img src="/img/qrcode-exemplo.png" alt="QR Code" className="finalizacao-qrcode" />
            <button
              className="finalizacao-copiar"
              onClick={() => navigator.clipboard.writeText("link-pagamento")}
            > 
              Copiar link
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
