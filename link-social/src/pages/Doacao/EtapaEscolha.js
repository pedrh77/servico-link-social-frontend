import React, { useEffect, useState } from "react";
import "./EtapaEscolha.css";
import { getOngs } from "../../Api.js";
import SelecaoCardList from "../../Components/SelecaoCardList.js";
import   Header from "../../Components/Header.js";

export default function EtapaEscolha() {
  return (
    <SelecaoCardList
      titulo="Escolha uma ONG"
      fetchData={getOngs}
      storageKey="ongSelecionada"
      nextRoute="/etapa-valores"
      links={[{ label: "Inicio", path: "/Home" }]}
    />
  );
}