import Link from "next/link";
import { fetchProducts } from "@/lib/api";

const FALLBACK_PRODUCTS = [
  { slug: "masque-hydratant-argan", name: "Masque Hydratant Argan", tag: "INTENSE", price: "225", img: "Produit 1.jpg" },
  { slug: "shampooing-charbons", name: "Shampooing Charbons", tag: "PURIFIANT", price: "185", img: "Produit 2.jpg" },
  { slug: "gloss-lavande", name: "Gloss Lavande", tag: "BRILLANCE", price: "145", img: "Produit 3.jpg" },
  { slug: "soins-solaires", name: "Soins Solaires", tag: "PROTECTION", price: "255", img: "Produit 4.jpg" },
  { slug: "huile-capillaire-cocotte", name: "Huile Capillaire Cocotte", tag: "NOURRISTANT", price: "195", img: "Hero Produits.jpg.jpg" },
  { slug: "coiffant-eclat-karite", name: "Coiffant Éclat Karité", tag: "BOUCLES", price: "165", img: "Produit 6.jpg" },
  { slug: "serum-reparateur", name: "Sérum Réparateur", tag: "RÉPARATION", price: "210", img: "serum reparateur.jpg" },
  { slug: "baume-hydratant", name: "Baume Hydratant", tag: "HYDRATATION", price: "175", img: "Image Produit 8.jpg" },
];

export default async function ProduitsPage() {
  const apiProducts = await fetchProducts();
  const useApi = apiProducts.length > 0;

  return (
    <main className="page-main">
      <section className="hero hero--page hero--page-produits" id="hero">
        <div className="hero--page-bg" role="img" aria-label="Nos produits" />
        <div className="hero--page-overlay" />
        <div className="container hero--page-inner">
          <h1 className="hero-headline">
            <span className="hero-headline--serif">Découvrez</span>
            <span className="hero-headline--bold">nos produits</span>
          </h1>
          <p className="hero-text">Soins capillaires naturels pour sublimer vos cheveux au quotidien.</p>
          <Link href="#produits-grid" className="btn btn-hero-maskin">Voir le catalogue</Link>
        </div>
      </section>

      <section className="products products-page" id="produits-grid">
        <div className="container">
          <div className="products-grid products-grid--elegant products-grid--large">
            {useApi
              ? apiProducts.map((p) => {
                  const img = p.images?.[0]?.url ?? "";
                  const priceStr = p.price != null ? `${p.price}` : "—";
                  return (
                    <article key={p.id} className="product-card product-card--elegant">
                      <Link
                        href={`/produits/${p.slug}`}
                        className="product-image"
                        style={{ background: img ? `url('/${img}') center/cover` : undefined }}
                      />
                      <div className="product-info">
                        <h3 className="product-name">
                          <Link href={`/produits/${p.slug}`}>{p.name}</Link>
                        </h3>
                        <p className="product-tag">{p.tag ?? ""}</p>
                        <div className="product-footer">
                          <p className="product-price">{priceStr} €</p>
                          <Link href={`/produits/${p.slug}`} className="btn btn-violet">
                            Voir le produit
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              : FALLBACK_PRODUCTS.map((p) => (
                  <article key={p.slug} className="product-card product-card--elegant">
                    <Link
                      href={`/produits/${p.slug}`}
                      className="product-image"
                      style={{ background: `url('/images/${p.img}') center/cover` }}
                    />
                    <div className="product-info">
                      <h3 className="product-name">
                        <Link href={`/produits/${p.slug}`}>{p.name}</Link>
                      </h3>
                      <p className="product-tag">{p.tag}</p>
                      <div className="product-footer">
                        <p className="product-price">{p.price} €</p>
                        <Link href={`/produits/${p.slug}`} className="btn btn-violet">
                          Voir le produit
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
}
