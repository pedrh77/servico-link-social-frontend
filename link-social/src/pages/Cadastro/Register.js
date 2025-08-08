import React, { useState } from "react";
import { cadastrarUsuario } from "../../Api";
import "./Register.css";

export default function RegisterPage() {
  const [tipoUsuario, setTipoUsuario] = useState("Doador");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const tipoUsuarioEnum = tipoUsuario === "Doador" ? 0 : 1;

    const dados = {
      nome,
      telefone,
      email,
      tipoUsuario: tipoUsuarioEnum,
      senha,
      confirmaSenha: confirmarSenha,
      cpf: tipoUsuarioEnum === 0 ? cpfCnpj : null,
      cnpj: tipoUsuarioEnum === 1 ? cpfCnpj : null,
    };

    try {
      const resposta = await cadastrarUsuario(dados);
      if (resposta?.sucesso || resposta?.ok) {
        setSucesso("Cadastro realizado com sucesso!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErro(resposta?.mensagem || "Erro ao cadastrar.");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

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

        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Tipo de usuário
            <select
              value={tipoUsuario}
              onChange={(e) => {
                setTipoUsuario(e.target.value);
                setCpfCnpj("");
                setNome("");
              }}
              required
            >
              <option value="Doador">Doador</option>
              <option value="ONG">ONG</option>
            </select>
          </label>

          <label>
            {tipoUsuario === "ONG" ? "Nome da ONG" : "Seu nome completo"}
            <input
              type="text"
              placeholder={
                tipoUsuario === "ONG"
                  ? "Digite o nome da ONG"
                  : "Digite seu nome"
              }
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            {tipoUsuario === "Doador" ? "CPF" : "CNPJ"}
            <input
              type="text"
              placeholder={`Digite seu ${tipoUsuario === "Doador" ? "CPF" : "CNPJ"}`}
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </label>

          {erro && <p className="error">{erro}</p>}
          {sucesso && <p className="success">{sucesso}</p>}

          <button type="submit" className="register-button">
            Cadastrar
          </button>

          <p className="login-link">
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </form>
      </main>
    </div>
  );
}
