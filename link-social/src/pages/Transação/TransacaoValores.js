import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import "./TransacaoValores.css";

const links = [
  { label: "Inicio", path: "/Home" },
  { label: "Meu Perfil", path: "/Usuario" },
];

export default function TransacaoValores() {
  const [saldo, setSaldo] = useState(0);
  const [valorConta, setValorConta] = useState("");
  const [valorUsar, setValorUsar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saldoStorage = sessionStorage.getItem("saldo");
    setSaldo(Number(saldoStorage || 0));
  }, []);

  const handleValorConta = (e) => {
    let valor = Number(e.target.value);
    if (valor < 0) valor = 0; // bloqueia negativos
    setValorConta(valor);
    setValorUsar("");
  };

  const handleValorUsar = (e) => {
    let valor = Number(e.target.value);
    if (valor < 0) valor = 0; // bloqueia negativos

    const limite = Math.min(saldo, (Number(valorConta) || 0) / 2);
    if (valor <= limite) {
      setValorUsar(valor);
    } else {
      setValorUsar(limite);
    }
  };

  const handleConfirmar = async () => {
    if (!valorConta || valorConta <= 0) {
      alert("Informe um valor de conta válido (maior que 0).");
      return;
    }
    if (!valorUsar || valorUsar <= 0) {
      alert("Informe um valor a usar válido (maior que 0).");
      return;
    }

    setLoading(true);
    // pegando doador e empresa do storage
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    const empresaSelecionada = JSON.parse(sessionStorage.getItem("empresaSelecionada"));

    if (!usuarioLogado || !empresaSelecionada) {
      alert("Usuário ou empresa não encontrados na sessão!");
      return;
    }

    const dto = {
      doadorId: usuarioLogado.id,
      empresaId: empresaSelecionada.id,
      tipo: 2,
      valor: Number(valorUsar),
      valorTotal: Number(valorConta),
    };

    sessionStorage.setItem("transacao", JSON.stringify(dto));

    console.log("Enviando DTO:", dto);
    window.location.href = "/transacao-validacao";
  };

  const limitePermitido = Math.min(saldo, (Number(valorConta) || 0) / 2);

  return (
    <>
      <Header links={links} />

      <div className="transacao-container">
        <h2 className="titulo-card">Usar Saldo em Empresas Parceiras</h2>

        <div className="card-saldo">
          <p>
            <b>Saldo disponível:</b>{" "}
            <span className="saldo">R$ {saldo.toFixed(2)}</span>
          </p>
        </div>

        <div className="campo">
          <label>Valor total da conta:</label>
          <input
            type="number"
            value={valorConta}
            onChange={handleValorConta}
            placeholder="Digite o valor da conta"
            min="0"
          />
        </div>

        {valorConta > 0 && (
          <>
            <div className="campo">
              <label>
                Valor a usar (máx. R$ {limitePermitido.toFixed(2)}):
              </label>
              <input
                type="number"
                value={valorUsar}
                onChange={handleValorUsar}
                placeholder="Digite quanto quer usar"
                min="0"
              />
            </div>

            <p className="info">
              Você só pode usar até <b>metade do valor da conta</b>, respeitando
              o limite do seu saldo.
            </p>
            <section className="confirmar-container">
              <button
                className="botao-confirmar"
                onClick={handleConfirmar}
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar Transação"}
              </button>
            </section>

            <p className="aviso-validacao">
              ⚠️ O valor informado será <b>conferido com a nota fiscal</b>.
              Preencha corretamente para evitar problemas na validação.
            </p>
          </>
        )}
      </div>
    </>
  );
}
