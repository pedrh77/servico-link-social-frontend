import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { getEmpresas } from "../../Api";

export default function NovaTransacao() {
    const [usuario, setUsuario] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

    useEffect(() => {
        const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
        setUsuario(usuarioLogado);

        async function fetchDados() {
            try {
                const empresasData = await getEmpresas();
                setEmpresas(empresasData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchDados();
    }, []);

    function handleEscolher(emp) {
        setEmpresaSelecionada(emp);
    }

    function handleAvancar() {
        if (!empresaSelecionada) {
            alert("Selecione uma empresa antes de avançar!");
            return;
        }
        console.log("Avançando com:", empresaSelecionada);
        // Exemplo: redirecionar
        // navigate("/proximaEtapa");
    }

    const links = [{ label: "Inicio", path: "/Home" }];

    return (
        <>
            <Header links={links} />
            <h1 className="titulo">Escolha uma Empresa</h1>

            <div className="grid-ongs">
                {empresas.map((emp) => (
                    <div
                        key={emp.id}
                        className={`card-ong ${empresaSelecionada?.id === emp.id ? "selecionada" : ""}`}
                        tabIndex={0}
                    >
                        <div className="info-ong">
                            <h3>{emp.nome}</h3>
                            <div className="tag">
                                {emp.comentario == null ? <p>Sem descrição</p> : <p>{emp.comentario}</p>}
                            </div>
                            <button
                                className="btn-escolher"
                                onClick={() => handleEscolher(emp)}
                                aria-label={`Escolher ${emp.nome}`}
                            >
                                {empresaSelecionada?.id === emp.id ? "Selecionada" : "Escolher"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="btn-avancar-container">
                <button
                    className="botao-avancar"
                    onClick={handleAvancar}
                    aria-label="Avançar para próxima etapa"
                >
                    Avançar
                </button>
            </div>
        </>
    );
}
