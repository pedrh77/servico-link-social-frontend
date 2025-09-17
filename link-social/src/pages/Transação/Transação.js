import React from "react";
import { getEmpresas } from "../../Api";
import SelecaoCardList from "../../Components/SelecaoCardList.js";

export default function NovaTransacao() {
  return (
    <SelecaoCardList
      titulo="Escolha uma Empresa"
      fetchData={getEmpresas}
      storageKey="empresaSelecionada"
      nextRoute="/transacao-valores"
      links={[
        { label: "Inicio", path: "/Home" },
        { label: "Meu Perfil", path: "/Usuario" },
      ]}
    />
  );
}