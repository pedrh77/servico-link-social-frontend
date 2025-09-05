import React, { useState, useEffect } from "react";
import "./Header.css";

export default function Header({ links = [] }) {
  const [logado, setLogado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const currentPath = window.location.pathname;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const isLogado = !!token;
    setLogado(isLogado);

    // Se estiver logado e na home, redireciona para /usuario
    if (isLogado && currentPath === "/") {
      window.location.href = "/usuario";
    }
  }, [currentPath]);

  function handleLogout() {
    sessionStorage.removeItem("token");
    setLogado(false);
    window.location.href = "/login";
  }

  let renderButtons;
  if (logado) {
    renderButtons = <button className="logout" onClick={handleLogout}>Sair</button>;
  } else if (currentPath !== "/register") {
    renderButtons = (
      <>
        <a href="/login" className="login">Entrar</a>
        <button className="signup" onClick={() => (window.location.href = "/register")}>
          Cadastrar
        </button>
      </>
    );
  } else {
    renderButtons = null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        </div>

        <button className="hamburger" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>

        <nav className={`nav ${menuAberto ? "show" : ""}`}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className={link.path === currentPath ? "active" : ""}
            >
              {link.label}
            </a>
          ))}

          {renderButtons}
        </nav>
      </div>
    </header>
  );
}
