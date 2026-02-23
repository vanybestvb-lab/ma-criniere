import Link from "next/link";

export default function AProposPage() {
  return (
    <main className="page-main">
      <section className="hero hero--page hero--page-apropos" id="hero">
        <div className="hero--page-bg" role="img" aria-label="Ma Crinière" />
        <div className="hero--page-overlay" />
        <div className="container hero--page-inner">
          <h1 className="hero-headline">
            <span className="hero-headline--serif">À propos de</span>
            <span className="hero-headline--bold">Ma Crinière</span>
          </h1>
          <p className="hero-text">Votre beauté capillaire, notre passion depuis Kinshasa.</p>
          <Link href="#histoire" className="btn btn-hero-maskin">Notre histoire</Link>
        </div>
      </section>

      <section className="about-intro" id="histoire">
        <div className="container about-intro-inner">
          <div className="about-intro-text">
            <h2>Notre histoire</h2>
            <p>Ma Crinière est née à Kinshasa, RDC, de l&apos;envie d&apos;offrir des soins capillaires de qualité, naturels et accessibles.</p>
            <p>De la boutique locale à votre panier en ligne, nous avons à cœur de vous accompagner avec des conseils d&apos;experts et une livraison rapide.</p>
          </div>
          <div className="about-intro-visual" role="img" aria-label="Soins capillaires" />
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <p className="section-subtitle">CE QUI NOUS ANIME</p>
          <h2 className="section-title">Nos valeurs</h2>
          <div className="engagements-grid">
            <div className="engagement-card">
              <div className="engagement-icon"><span>🌱</span></div>
              <h3>Naturel & éthique</h3>
              <p>Formules à base d&apos;ingrédients naturels et pratiques respectueuses de l&apos;environnement.</p>
            </div>
            <div className="engagement-card">
              <div className="engagement-icon"><span>⭐</span></div>
              <h3>Qualité premium</h3>
              <p>Chaque produit est sélectionné pour une efficacité optimale sur tous types de cheveux.</p>
            </div>
            <div className="engagement-card">
              <div className="engagement-icon"><span>💬</span></div>
              <h3>Proximité & conseil</h3>
              <p>Notre équipe vous guide selon vos besoins et votre type de cheveux.</p>
            </div>
            <div className="engagement-card">
              <div className="engagement-icon"><span>🚀</span></div>
              <h3>Simplicité & rapidité</h3>
              <p>Commande en quelques clics, livraison express.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2 className="section-title">Prêt à sublimer vos cheveux ?</h2>
          <p className="section-desc">Découvrez notre catalogue.</p>
          <Link href="/produits" className="btn btn-primary">VOIR NOS PRODUITS <span className="arrow">→</span></Link>
        </div>
      </section>
    </main>
  );
}
