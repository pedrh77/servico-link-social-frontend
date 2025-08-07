import React, { useState } from "react";
import "./Register.css";

export default function RegisterPage() {
  const [tipoUsuario, setTipoUsuario] = useState("Doador");

  return (
    <div className="register-page manjari-regular">
      <header className="header-no-bg">
        <div className="header-left">
          <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        </div>
      </header>

      <main className="register-container">
        <h2 className="manjari-bold">Crie sua conta</h2>
        <p>Faça parte do Link Social e conecte-se com causas que transformam.</p>

        <form className="register-form">
          <label>
            Nome completo
            <input type="text" placeholder="Digite seu nome" required />
          </label>

          <label>
            Telefone
            <input type="tel" placeholder="Digite seu telefone" required />
          </label>

          <label>
            E-mail
            <input type="email" placeholder="Digite seu e-mail" required />
          </label>

          <label>
            Tipo de usuário
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              required
            >
              <option value="Doador">Doador</option>
              <option value="ONG">ONG</option>
            </select>
          </label>

          {tipoUsuario === "Doador" && (
            <label>
              CPF
              <input type="text" placeholder="Digite seu CPF" required />
            </label>
          )}

          {tipoUsuario === "ONG" && (
            <label>
              CNPJ
              <input type="text" placeholder="Digite seu CNPJ" required />
            </label>
          )}

          <label>
            Senha
            <input type="password" placeholder="Crie uma senha" required />
          </label>

          <label>
            Confirmar senha
            <input type="password" placeholder="Confirme sua senha" required />
          </label>

          <button type="submit" className="register-button">Cadastrar</button>

          <p className="login-link">
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      </main>
    </div>
  );
}