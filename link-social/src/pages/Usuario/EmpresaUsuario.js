import React, { useState, useEffect } from "react";
import { getBeneficiosPorOngId, criarBeneficio as apiCriarBeneficio } from "../../Api";
import "./Usuario.css";

export default function EmpresaUsuario({ dados }) {
  const [beneficios, setBeneficios] = useState([]);
  const [descricaoBeneficio, setDescricaoBeneficio] = useState("");
  const [valorBeneficio, setValorBeneficio] = useState("");
  const [showCadastroBeneficios, setShowCadastroBeneficios] = useState(false);
  const [showBeneficiosAtivos, setShowBeneficiosAtivos] = useState(false);

  useEffect(() => {
    async function carregarBeneficios() {
      if (dados?.id) {
        const lista = await getBeneficiosPorOngId(dados.id);
        setBeneficios(lista);
      }
    }
    carregarBeneficios();
  }, [dados?.id]);

  const criarNovoBeneficio = async () => {
    if (!descricaoBeneficio.trim() || !valorBeneficio) {
      alert("Preencha descrição e valor do benefício.");
      return;
    }
    try {
      const novoBeneficio = {
        UsuarioId: dados.id,
        Descricao: descricaoBeneficio,
        Valor: parseFloat(valorBeneficio),
      };

      const response = await apiCriarBeneficio(novoBeneficio);
      if (!response.ok) throw new Error("Falha ao criar benefício");

      const listaAtualizada = await getBeneficiosPorOngId(dados.id);
      setBeneficios(listaAtualizada);

      setDescricaoBeneficio("");
      setValorBeneficio("");
      alert("Benefício criado com sucesso!");
    } catch (err) {
      alert("Erro ao criar benefício: " + err.message);
    }
  };

  return (
    <>
      <section className="accordion-section">
        <button className="accordion-header" onClick={() => setShowCadastroBeneficios(!showCadastroBeneficios)}>
          Cadastro de Benefícios
          <span>{showCadastroBeneficios ? "-" : "+"}</span>
        </button>
        {showCadastroBeneficios && (
          <form onSubmit={(e) => { e.preventDefault(); criarNovoBeneficio(); }}>
            <label>
              Descrição:
              <textarea value={descricaoBeneficio} onChange={(e) => setDescricaoBeneficio(e.target.value)} rows="4" required />
            </label>
            <label>Valor:</label>
            <div>
              {[5, 10, 20, 50].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={valorBeneficio == v ? "selecionado" : ""}
                  onClick={() => setValorBeneficio(v)}
                >
                  R$ {v}
                </button>
              ))}
            </div>
            <button type="submit">Criar Benefício</button>
          </form>
        )}
      </section>

      <section className="accordion-section">
        <button className="accordion-header" onClick={() => setShowBeneficiosAtivos(!showBeneficiosAtivos)}>
          Benefícios Ativos
          <span>{showBeneficiosAtivos ? "-" : "+"}</span>
        </button>
        {showBeneficiosAtivos && (
          <div>
            {beneficios.length === 0 ? <p>Você ainda não possui benefícios cadastrados.</p> : (
              <ul>
                {beneficios.map((b) => (
                  <li key={b.id}>
                    <p>{b.descricao}</p>
                    <p>R$ {b.valor.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </>
  );
}
