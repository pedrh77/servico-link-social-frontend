import React, { useEffect } from "react";
import "./Home.css";



export default function Home() {

  useEffect(() => {
  const toggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  const toggleMenu = () => {
    navMenu.classList.toggle("show");
  };

  toggleBtn.addEventListener("click", toggleMenu);

  
  return () => {
    toggleBtn.removeEventListener("click", toggleMenu);
  };
}, []);
  return (
    <div className="landing-page manjari-regular">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/img/logo-link.svg" alt="Logo" className="logo" />
          </div>

          <button className="hamburger" id="menu-toggle">☰</button>

          <nav className="nav" id="nav-menu">
            <a href="#parceiros">Parceiros</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#planos">Planos</a>
            <a href="/login" className="login">Entrar</a>
            <button className="signup"  onClick={() => window.location.href = '/register'}>Cadastrar</button>
          </nav>
        </div>
      </header>

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
            { name: "ABRAPEC", logo: "/img/ABRAPEC.svg" },
            { name: "Obreiros do Bem", logo: "/img/OBREIROS.svg" },
            { name: "It's Sweet", logo: "/img/ITSWEET.svg" },
            { name: "Amarello", logo: "/img/CERVEJARIA.svg" },
            { name: "Adevrip", logo: "/img/ADEVIR.svg" },
          ].map(({ name, logo }) => (
            <div key={name} className="partner-card">
              <div className="partner-logo-placeholder">
                <img src={logo} alt={name}/>
              </div>
              <div className="badge-container">
                <div className="badge">
                  <img className="estrela" src="/img/estrela.svg" alt="Estrela" />
                  <span className="badge-text">Benefício</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="join">
        <h4 className="manjari-bold">Seja um parceiro</h4>
        <p>Junte-se à nossa rede de transformação social e aproveite todos os benefícios como os comunicados acima.</p>
        <button className="join-button">Quero ser um Parceiro!</button>
      </section>

      <section className="benefits" id="beneficios">
        <h3 className="manjari-bold">Benefícios do Link Social</h3>
        <div className="benefit-cards">
          {[{
            title: "Para Doadores",
            items: [
              "Validação de ONGs",
              "Histórico de doações",
              "Relatórios de impacto",
              "Controle financeiro de doações",
            ],
          }, {
            title: "Para Estabelecimentos",
            items: [
              "Aumento de base de clientes",
              "Marketing social",
              "Engajamento com a comunidade",
              "Melhora da reputação",
            ],
          }, {
            title: "Para ONGs",
            items: [
              "Mais visibilidade e arrecadação",
              "Captação facilitada",
              "Gestão simplificada",
              "Transparência para doadores",
            ],
          }].map(({ title, items }) => (
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

      <section className="plans" id="planos">
        <h3 className="manjari-bold">Planos</h3>
        <div className="plan-cards">
          {["Básico", "Intermediário", "Avançado", "Personalizado"].map((plan) => (
            <div key={plan} className="plan-card">
              <h4 className="manjari-bold">{plan}</h4>
              <p>
                Escolha o plano ideal para sua necessidade e conte com recursos exclusivos para maximizar seu impacto social.
              </p>
              <button className="plan-button">Assinar</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <h4 className="manjari-bold">Faça Parte dessa Corrente do Bem</h4>
        <p>Junte-se a nós e fortaleça todo o nosso terceiro setor, conectando doadores, ONGs e estabelecimentos.</p>
        <button className="donate-button">Comece a Doar &rarr;</button>
      </footer>
    </div>
  );
}
