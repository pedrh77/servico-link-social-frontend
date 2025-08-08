import React from "react";
import "./Login.css";

export default function LoginPage() {
  return (
    <div className="login-page manjari-regular">
      <header className="login-header">
        <img src="/img/logo-link.svg" alt="Logo" className="login-logo" />
      </header>

      <main className="login-container">
        <h2 className="manjari-bold">Bem-vindo!</h2>
        <p>Entre ou cadastre-se para continuar</p>

        <form className="login-form">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu email." required />

          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha." required />

          <button type="submit" className="login-button">Entrar</button>

          <p className="signup-link">
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </main>
    </div>
  );
}
