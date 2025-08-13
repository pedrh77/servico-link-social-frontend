import "./Login.css";
import React, { useState } from "react";
import { login } from "../../Api.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const result = await login(email, senha);
      console.log(result);
      if (result.status === 200) {
        sessionStorage.setItem("token", result.token);
        window.location.href = "/usuario"; 
      } else {
        setErro(result.mensagem || "Login falhou");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page manjari-regular">
      <header className="login-header">
        <img src="/img/logo-link.svg" alt="Logo" className="login-logo" />
      </header>

      <main className="login-container">
        <h2 className="manjari-bold">Bem-vindo!</h2>
        <p>Entre ou cadastre-se para continuar</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {erro && <div className="login-error">{erro}</div>}

          <p className="signup-link">
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </form>
      </main>
    </div>
  );
}
