import React, { useState, useEffect } from "react";
import { GetDoacoesByDoador, GetCarteiraByUsuarioId } from "../Api.js";
import AccordionSection from "./AccordionSection";
import CardDoacao from "./DoacaoCard.js";
import Header from "./Header.js";
import "./DoadorUsuario.css";

export default function DoadorUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [carteira, setCarteira] = useState(null);



  useEffect(() => {
    async function carregarDados() {
      if (dados?.id) {
        const lista = await GetDoacoesByDoador(dados.id);
        setDoacoes(lista);

        const c = await GetCarteiraByUsuarioId(dados.id);
        setCarteira(c);
      }
    }
    carregarDados();
  }, [dados?.id]);

  function agruparPorStatus(transacoes) {
    return transacoes.reduce((acc, t) => {
      const status = t.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(t);
      return acc;
    }, {});
  }
  const links = [
    { label: "Inicio", path: "/Home" }, { label: "Doe Agora", path: "/etapa-selecao" }
  ];
  return (
    <>
      <Header links={links} />
      <AccordionSection title="Minha Carteira">
        {!carteira ? (
          <p>Carregando carteira...</p>
        ) : (
          <div>
            <div className="">
              <p>
                <strong>Saldo:</strong> R$ {carteira.saldo.toFixed(2)}
              </p>
              <button
                className="btn-escolher"
                onClick={() => alert("Abrir modal de Novo Pagamento")}
              >
                Usar Saldo
              </button>
            </div>

            {/* Transações agrupadas */}
            {console.log(carteira.transacoes)}
            {Object.entries(agruparPorStatus(carteira.transacoes)).map(
              ([status, transacoes]) => (
                <div key={status} className="mb-4">
                  <h4 className="font-semibold mb-2">{status}</h4>
                  <ul className="space-y-2">
                    {transacoes.map((t) => (
                      <li
                        key={t.id}
                        className="p-2 border rounded-lg shadow-sm flex justify-between"
                      >
                        <span>
                          {t.tipo === 1 ? "Crédito" : "Débito"} - R${" "}
                          {t.valor.toFixed(2)}
                        </span>
                        <span>{new Date(t.data).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        )}
      </AccordionSection>

      <div className="ong-usuario">
        <AccordionSection title="Doações Feitas">

          {doacoes.length === 0 ? (
            <p>Você ainda não realizou uma doação.</p>
          ) : (
            <ul className="lista-doacoes">
              <li className="lista-header">
                <span>Doador</span>
                <span>Valor</span>
                <span>Tipo</span>
                <span>Status</span>
                <span>Comentário</span>
              </li>
              {doacoes.map((d) => (
                <CardDoacao key={d.id} doacao={d} />
              ))}
            </ul>
            
          )}
          <div >
            <button className="btn-escolher"
              onClick={() => window.location.href = '/etapa-selecao'}
            >
              Realizar doação.
            </button>
          </div>
        </AccordionSection>

        {/* Carteira */}

      </div>
    </>
  );
}