import React, { useState } from 'react';
import EtapaEscolhaOng from './EtapaEscolhaOng'; // Supondo que este componente exista
import EtapaValores from './EtapaValores'; // Supondo que este componente exista
import EtapaFinalizacao from './EtapaFinalizacao';

export default function Doacao() {
  const [etapa, setEtapa] = useState(1);
  const [ong, setOng] = useState(null);
  const [valor, setValor] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [meses, setMeses] = useState(null);

  const handleSelectOng = (selectedOng) => {
    setOng(selectedOng);
    setEtapa(2);
  };

  const handleSelectValor = (dadosValor) => {
    setValor(dadosValor.valor);
    setTipo(dadosValor.tipo);
    setMeses(dadosValor.meses);
    setEtapa(3);
  };

  const handleEditarOng = () => {
    setEtapa(1);
  };

  const handleEditarValor = () => {
    setEtapa(2);
  };

  switch (etapa) {
    case 1:
      return <EtapaEscolhaOng onSelectOng={handleSelectOng} />;
    case 2:
      return <EtapaValores onSelectValor={handleSelectValor} />;
    case 3:
      return (
        <EtapaFinalizacao
          ong={ong}
          valor={valor}
          tipo={tipo}
          meses={meses}
          onEditarOng={handleEditarOng}
          onEditarValor={handleEditarValor}
        />
      );
    default:
      return <EtapaEscolhaOng onSelectOng={handleSelectOng} />;
  }
}
