import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src="/img/logo-link.svg" alt="Logo" className="logo" />
        </div>

        <div className="nav-container">
          <nav className="nav">
            <a href="#">Parceiros</a>
            <a href="#">Benefícios</a>
            <a href="#">Planos</a>
            <a href="#" className="login">Entrar</a>
            <button className="signup">Cadastrar</button>
          </nav>
        </div>
      </header>

      {/* Sobre nós */}
      <section className="about">
        <div className="about-text">
          <h2>Sobre nós</h2>
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
        <img src="/img/explain.svg" alt="Sobre nós" className="about-image" />
      </section>

      {/* Parceiros Premium */}
      <section className="partners">
        <h3>Parceiros Premium</h3>
        <div className="partner-cards">
          {["ABRAPEC", "Criança do Bem", "It's Sweet", "Amarello", "Adevrip"].map((name) => (
            <div key={name} className="partner-card">
              <img src={`/${name.toLowerCase().replace(/\s/g, '-').replace(/'/g, '')}.png`} alt={name} />
              <a href="#" className="partner-link">Ver campanha</a>
            </div>
          ))}
        </div>
      </section>

      {/* Seja um parceiro */}
      <section className="join">
        <h4>Seja um parceiro</h4>
        <p>Junte-se à nossa rede de transformação social e aproveite todos os benefícios como os comunicados acima.</p>
        <button className="join-button">Quero ser um Parceiro!</button>
      </section>

      {/* Benefícios */}
      <section className="benefits">
        <h3>Benefícios do Link Social</h3>
        <div className="benefit-cards">
          {[
            {
              title: "Para Doadores",
              items: ["Validação de ONGs", "Histórico de doações", "Relatórios de impacto", "Controle financeiro de doações"],
            },
            {
              title: "Para Estabelecimentos",
              items: ["Aumento de base de clientes", "Marketing social", "Engajamento com a comunidade", "Melhora da reputação"],
            },
            {
              title: "Para ONGs",
              items: ["Mais visibilidade e arrecadação", "Captação facilitada", "Gestão simplificada", "Transparência para doadores"],
            },
          ].map(({ title, items }) => (
            <div key={title} className="benefit-card">
              <h4>{title}</h4>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="plans">
        <h3>Planos</h3>
        <div className="plan-cards">
          {["Básico", "Intermediário", "Avançado", "Personalizado"].map((plan) => (
            <div key={plan} className="plan-card">
              <h4>{plan}</h4>
              <p>
                Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
              </p>
              <button className="plan-button">Assinar</button>
            </div>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="footer">
        <h4>Faça Parte dessa Corrente do Bem</h4>
        <p>Junte-se a nós e fortaleça todo o nosso terceiro setor, conectando doadores, ONGs e estabelecimentos.</p>
        <button className="donate-button">Comece a Doar →</button>
      </footer>
    </div>
  );
}
