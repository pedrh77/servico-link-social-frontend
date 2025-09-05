import React, { useState } from "react";
import { GetDoacoesByOngId } from "../../Api";
import "./Usuario.css";

export default function DoadorUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);

  React.useEffect(() => {
    async function carregarDoacoes() {
      try {
        const lista = await GetDoacoesByOngId(dados.id);
        if (!cancelado) setDoacoes(lista);
      } catch (err) {
        if (!cancelado) setError(err.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    let cancelado = false;
    carregarDoacoes();
    return () => { cancelado = true; };
  }, [dados?.id]);

  const tipoDoacaoTexto = (tipo) =>
    ({ 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" }[tipo] || "Desconhecido");

  const statusTexto = (status) =>
    ({ 0: "Pendente", 1: "Pago", 2: "Cancelado" }[status] ?? "Desconhecido");

  return (
    <section className="accordion-section">
      <button className="accordion-header" type="button" aria-expanded={true}>
        Minhas Doações
      </button>
      <div className="lista-doacoes-container">
        {doacoes.length === 0 ? <p>Você ainda não possui doações.</p> : (
          <ul className="lista-doacoes">
            {doacoes.map((d) => (
              <li key={d.id}>
                <p>ONG: {d.nomeOng ?? "Desconhecida"}</p>
                <p>Benefício: {d.descricaoBeneficio ?? "-"}</p>
                <p>Valor: R$ {(d.valor ?? 0).toFixed(2)}</p>
                <p>Tipo: {tipoDoacaoTexto(d.tipoDoacao)}</p>
                <p>Status: {statusTexto(d.statusPagamento)}</p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => (window.location.href = "/etapa-selecao")}>Nova Doação</button>
      </div>
    </section>
  );
}