import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Eye, EyeOff } from "lucide-react";
import { cadastrarUsuario } from "../../Api";
import "./Register.css";
import Header from "../../Components/Header";

export default function RegisterPage() {
  const [tipoUsuario, setTipoUsuario] = useState("Doador");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [descricao, setDescricao] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
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

    let tipoUsuarioEnum = 0;
    if (tipoUsuario === "ONG") tipoUsuarioEnum = 1;
    if (tipoUsuario === "Empresa") tipoUsuarioEnum = 2;

    const dados = {
      nome,
      telefone,
      email,
      tipoUsuario: tipoUsuarioEnum,
      senha,
      confirmaSenha: confirmarSenha,
      cpf: tipoUsuarioEnum === 0 ? cpfCnpj : null,
      cnpj: tipoUsuarioEnum === 1 || tipoUsuarioEnum === 2 ? cpfCnpj : null,
      comentario: tipoUsuarioEnum === 1 || tipoUsuarioEnum === 2 ? descricao : null,
    };

    try {
      const resposta = await cadastrarUsuario(dados);

      if (resposta?.sucesso || resposta?.ok || resposta?.status === 201) {
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

  const mascaraCpfCnpj =
    tipoUsuario === "Doador" ? "999.999.999-99" : "99.999.999/9999-99";

  const removerMascara = (valor) => valor.replace(/\D/g, "");
  const links = [{}];

  return (
    <>
      <Header links={links} />
      <div className="register-page manjari-regular">
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
                  setDescricao("");
                }}
                required
              >
                <option value="Doador">Doador</option>
                <option value="ONG">ONG</option>
                <option value="Empresa">Empresa</option>
              </select>
            </label>

            <label>
              {tipoUsuario === "ONG"
                ? "Nome da ONG"
                : tipoUsuario === "Empresa"
                ? "Nome da Empresa"
                : "Seu nome completo"}
              <input
                type="text"
                placeholder={
                  tipoUsuario === "ONG"
                    ? "Digite o nome da ONG"
                    : tipoUsuario === "Empresa"
                    ? "Digite o nome da empresa"
                    : "Digite seu nome"
                }
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>

            <label>
              Telefone
              <InputMask
                mask="(99) 99999-9999"
                placeholder="Digite seu telefone"
                value={telefone}
                onChange={(e) => setTelefone(removerMascara(e.target.value))}
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
              <InputMask
                mask={mascaraCpfCnpj}
                placeholder={`Digite seu ${
                  tipoUsuario === "Doador" ? "CPF" : "CNPJ"
                }`}
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(removerMascara(e.target.value))}
                required
              />
            </label>

            {(tipoUsuario === "ONG" || tipoUsuario === "Empresa") && (
              <label>
                Descrição
                <textarea
                  placeholder={`Digite uma descrição sobre sua ${
                    tipoUsuario === "ONG" ? "ONG" : "Empresa"
                  }`}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </label>
            )}

            <label>
              Senha
              <div className="password-field">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Crie uma senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label>
              Confirmar senha
              <div className="password-field">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarConfirmarSenha ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>
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
    </>
  );
}
