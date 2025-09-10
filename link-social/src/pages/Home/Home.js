import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../Components/Header.js";
import { getUsuarioAutenticado } from "../../Api";

export default function Home() {
  const [logado, setLogado] = useState(false);

  const [dados, setDados] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setLogado(!!token);
  }, []);

  useEffect(() => {
      async function carregarUsuario() {
        try {
          const usuario = await getUsuarioAutenticado();
          setDados(usuario);
          setTipoUsuario(usuario.tipoUsuario);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      carregarUsuario();
    }, []);

  function handleredirect() {
    if (logado) {
      if (tipoUsuario === 0){
        window.location.href = "/etapa-selecao"
      } else{ alert("Doações não permitidas para esse Usuario.")}
    } else { window.location.href = "/login" }

    
  }

  const links = [
    { label: "Parceiros", path: "/#parceiros" },
    { label: "Benefícios", path: "/#beneficios" },
    { label: "Meu Perfil", path: "/Usuario" }
  ];

  return (
    <div className="landing-page manjari-regular">

      <Header links={links} />

      <section className="about" id="sobre">
        <div className="about-content">
          <div className="about-text">
            <h2 className="manjari-bold">Sobre nós</h2>
            <p>
              O Link Social nasceu com um propósito: fortalecer a cultura da doação no Brasil e aumentar o impacto das organizações do terceiro setor.
              Somos uma plataforma digital que conecta doadores, empresas e organizações sociais, promovendo a transparência e a confiança nesse ecossistema.
            </p>
            <p>
              Nosso objetivo é criar um ambiente onde os doadores, ONGs e estabelecimentos possam colaborar de forma transparente, gerando valor social real.
            </p>
            <p>
              Acreditamos que com ferramentas simples e eficazes, como o Link Social, é possível transformar boas intenções em ações concretas.
            </p>
          </div>
          <div className="about-image">
            <img src="/img/explain.svg" alt="Sobre nós" />
          </div>
        </div>
      </section>

      <section className="partners" id="parceiros">
        <h3 className="manjari-bold">Parceiros Premium</h3>
        <div className="partner-cards">
          {[
            { name: "ABRAPEC", logo: "/img/partner-01.svg" },
            { name: "Obreiros do Bem", logo: "/img/partner-02.svg" },
            { name: "It's Sweet", logo: "/img/partner-03.svg" },
            { name: "Amarello", logo: "/img/partner-04.svg" },
            { name: "Adevrip", logo: "/img/partner-05.svg" },
          ].map(({ name, logo }) => (
            <div key={name} className="partner-card">
              <div className="partner-logo-placeholder">
                <img src={logo} alt={name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="join">
        <h4 className="manjari-bold">Seja um parceiro</h4>
        <p>Junte-se à nossa rede de transformação social e aproveite todos os benefícios como os comunicados acima.</p>
        <button className="join-button" onClick={() => window.location.href = "/register"}>Quero ser um Parceiro!</button>
      </section>

      <section className="benefits" id="beneficios">
        <h3 className="manjari-bold">Benefícios do Link Social</h3>
        <div className="benefit-cards">
          {[
            {
              title: "Para Doadores",
              items: [
                "Validação de ONGs",
                "Histórico de doações",
                "Relatórios de impacto",
                "Controle financeiro de doações",
              ],
            },
            {
              title: "Para Estabelecimentos",
              items: [
                "Aumento de base de clientes",
                "Marketing social",
                "Engajamento com a comunidade",
                "Melhora da reputação",
              ],
            },
            {
              title: "Para ONGs",
              items: [
                "Mais visibilidade e arrecadação",
                "Captação facilitada",
                "Gestão simplificada",
                "Transparência para doadores",
              ],
            }
          ].map(({ title, items }) => (
            <div key={title} className="benefit-card">
              <h4 className="manjari-bold">{title}</h4>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <h4 className="manjari-bold">Faça Parte dessa Corrente do Bem</h4>
        <p>Junte-se a nós e fortaleça todo o nosso terceiro setor, conectando doadores, ONGs e estabelecimentos.</p>
        <button
          className="donate-button"
          onClick={() => handleredirect()}
        >
          Comece a Doar &rarr;
        </button>
      </footer>
    </div>
  );
}
