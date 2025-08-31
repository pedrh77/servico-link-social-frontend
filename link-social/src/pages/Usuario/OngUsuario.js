import React, { useState } from "react";
import { GetDoacoesByOngId } from "../../Api"
import "./Usuario.css";

export default function OngUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);

  React.useEffect(() => {  
    async function carregarDoacoes() {
      if (dados?.id) {
        const lista = await GetDoacoesByOngId(dados.id);
        setDoacoes(lista);
      }
    }
    carregarDoacoes();
  }, [dados?.id]);

  const tipoDoacaoTexto = (tipo) =>
    ({ 1: "Única", 2: "Mensal - 6x", 3: "Mensal - 12x" }[tipo] || "Desconhecido");

  const statusTexto = (status) =>
    ({ 0: "Pendente", 1: "Pago", 2: "Cancelado" }[status] ?? "Desconhecido");

  return (
    <section className="accordion-section">
      <button className="accordion-header" type="button" aria-expanded={true}>
        Doações Recebidas
      </button>
      <div className="lista-doacoes-container">
        {doacoes.length === 0 ? <p>Sua ONG ainda não recebeu doações.</p> : (
          <ul className="lista-doacoes">
            {doacoes.map((d) => (
              <li key={d.id}>
                <p>Doador: {d.nomeDoador ?? "Anônimo"}</p>
                <p>Benefício: {d.descricaoBeneficio ?? "-"}</p>
                <p>Valor: R$ {(d.valor ?? 0).toFixed(2)}</p>
                <p>Tipo: {tipoDoacaoTexto(d.tipoDoacao)}</p>
                <p>Status: {statusTexto(d.statusPagamento)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
