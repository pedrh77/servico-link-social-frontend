import React from "react";
import "./Header.css";

export default function Header({ usuario, onLogout }) {
  const linksPorTipo = {
    0: [ // Doador
      { label: "Minhas Doações", path: "/doacoes" },
      { label: "Nova Doação", path: "/etapa-selecao" },
    ],
    1: [ // ONG
      { label: "Doações Recebidas", path: "/doacoes" },
    ],
    2: [ // Empresa
      { label: "Cadastro de Benefícios", path: "/cadastro-beneficios" },
      { label: "Benefícios Ativos", path: "/beneficios-ativos" },
    ],
  };

  const links = linksPorTipo[usuario?.tipoUsuario] ?? [];

  return (
    <header className="header">
      <div className="logo-area">
        <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        <h1>Bem-vindo, {usuario?.nome ?? "Usuário"}</h1>
      </div>

      <nav>
        <ul className="menu-links">
          {links.map((l) => (
            <li key={l.path}>
              <a href={l.path}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}
