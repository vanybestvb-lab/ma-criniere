import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero hero--home" id="accueil">
        <div className="hero--home-bg" role="img" aria-label="Soins capillaires Ma Crinière" />
        <div className="hero--home-overlay" />
        <div className="container hero--home-content">
          <h1 className="hero-headline">
            <span className="hero-headline--serif">Sublimez</span>
            <span className="hero-headline--bold">vos cheveux</span>
          </h1>
          <p className="hero-text">
            Des soins capillaires premium pour nourrir, hydrater et sublimer votre chevelure.
          </p>
          <Link href="/produits" className="btn btn-hero-maskin">Découvrez nos produits</Link>
          <div className="hero-float-box hero-float-box--home">
            <span className="hero-float-value">100%</span>
            <span className="hero-float-check">✓</span>
            <p className="hero-float-label">Naturel</p>
          </div>
        </div>
      </section>

      <section className="products" id="produits">
        <div className="container">
          <div className="products-header">
            <div>
              <h2 className="section-title-maskin">Découvrez nos <span className="section-title-maskin--script">Incontournables</span></h2>
            </div>
            <Link href="/produits" className="btn btn-violet">VOIR TOUT</Link>
          </div>
          <div className="products-grid products-grid--elegant">
            {[
              { slug: "masque-hydratant-argan", name: "Masque Hydratant Argan", tag: "INTENSE", price: "225", img: "Produit 1.jpg" },
              { slug: "shampooing-charbons", name: "Shampooing Charbons", tag: "PURIFIANT", price: "185", img: "Produit 2.jpg" },
              { slug: "gloss-lavande", name: "Gloss Lavande", tag: "BRILLANCE", price: "145", img: "Produit 3.jpg" },
              { slug: "soins-solaires", name: "Soins Solaires", tag: "PROTECTION", price: "255", img: "Produit 4.jpg" },
            ].map((p) => (
              <article key={p.slug} className="product-card product-card--elegant">
                <Link href={`/produits/${p.slug}`} className="product-image" style={{ background: `url('/images/${p.img}') center/cover` }} />
                <div className="product-info">
                  <h3 className="product-name"><Link href={`/produits/${p.slug}`}>{p.name}</Link></h3>
                  <p className="product-tag">{p.tag}</p>
                  <div className="product-footer">
                    <p className="product-price">{p.price} €</p>
                    <Link href={`/produits/${p.slug}`} className="btn btn-violet">Voir le produit</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose">
        <div className="container why-choose-inner">
          <div className="why-choose-image" role="img" aria-label="Soins Ma Crinière" />
          <div className="why-choose-content">
            <h2 className="section-title-maskin">Pourquoi Choisir <span className="section-title-maskin--script">Ma Crinière</span></h2>
            <div className="why-choose-grid">
              <div className="why-choose-card">
                <h3>100% Naturel</h3>
                <p>Formules naturelles pour prendre soin de vos cheveux en douceur.</p>
              </div>
              <div className="why-choose-card">
                <h3>Spécialement Formulé</h3>
                <p>Soins conçus pour les cheveux afro, métis et bouclés.</p>
              </div>
              <div className="why-choose-card">
                <h3>Livraison Express</h3>
                <p>Livraison 24h ou 48h dans un rayon de 70 km.</p>
              </div>
              <div className="why-choose-card">
                <h3>Conseils Experts</h3>
                <p>Notre équipe vous accompagne pour trouver les produits adaptés.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="passion-banner">
        <div className="passion-banner-overlay" />
        <div className="container passion-banner-content">
          <h2 className="passion-banner-title">Une passion pour la <span className="passion-banner-title--script">Beauté Capillaire</span></h2>
          <p className="passion-banner-desc">Chez Ma Crinière, chaque crinière mérite des soins d&apos;exception.</p>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title-maskin">Ce que disent <span className="section-title-maskin--script">nos clients</span></h2>
          <p className="testimonials-subtitle">Des Témoignages Authentiques</p>
          <div className="testimonials-stars">★★★★★</div>
          <blockquote className="testimonial-quote">
            <span className="testimonial-quote-icon">&quot;</span>
            <p>Des produits qui ont transformé ma routine capillaire. Je recommande à 100 % !</p>
            <cite className="testimonial-author">— Marie K.</cite>
          </blockquote>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <p className="section-subtitle light">RESTER INFORMÉ</p>
          <h2 className="section-title light">Rejoignez notre communauté</h2>
          <p className="newsletter-desc">Recevez nos conseils et offres par email.</p>
          <form className="newsletter-form" action="#" method="post">
            <input type="email" placeholder="Votre adresse email..." required />
            <button type="submit" className="btn btn-yellow">S&apos;ABONNER</button>
          </form>
        </div>
      </section>
    </>
  );
}
