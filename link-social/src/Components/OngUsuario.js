import React, { useState, useEffect } from "react";
import { GetDoacoesByOngId, GetCarteiraByUsuarioId } from "../Api.js";
import AccordionSection from "./AccordionSection";
import CardDoacao from "./DoacaoCard.js";
import Header from "./Header.js";

export default function OngUsuario({ dados }) {
  const [doacoes, setDoacoes] = useState([]);
  const [carteira, setCarteira] = useState(null);


  
  useEffect(() => {
    async function carregarDados() {
      if (dados?.id) {
        const lista = await GetDoacoesByOngId(dados.id);
        setDoacoes(lista);

        const c = await GetCarteiraByUsuarioId(dados.id);
        setCarteira(c);
      }
    }
    carregarDados();
  }, [dados?.id]);

  // Função auxiliar para agrupar transações por status
  function agruparPorStatus(transacoes) {
    return transacoes.reduce((acc, t) => {
      const status = t.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(t);
      return acc;
    }, {});
  }
  const links = [
    { label: "Inicio", path: "/Home" }
  ];
  return (
    <>
      <Header links={links} />
      <div className="ong-usuario">
        {/* Doações */}
        <AccordionSection title="Doações Feitas">
          <div className="mb-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700"
              onClick={() => window.location.href = '/etapa-selecao'} // Redireciona para a página de nova doação")}
            >
              Nova Doação
            </button>
          </div>
          {doacoes.length === 0 ? (
            <p>Você ainda não doou.</p>
          ) : (
            <ul>
              {doacoes.map((d) => (
                <CardDoacao key={d.id} doacao={d} />
              ))}
            </ul>
          )}
        </AccordionSection>

        {/* Carteira */}
        <AccordionSection title="Minha Carteira">
          {!carteira ? (
            <p>Carregando carteira...</p>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p>
                  <strong>Saldo:</strong> R$ {carteira.saldo.toFixed(2)}
                </p>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700"
                  onClick={() => alert("Abrir modal de Novo Pagamento")}
                >
                  Novo Pagamento em Parceiro
                </button>
              </div>

              {/* Transações agrupadas */}
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
      </div>
    </>
  );
}
