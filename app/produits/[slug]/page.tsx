import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";

const PRODUCTS: Record<string, { name: string; tag: string; price: number; img: string; desc?: string }> = {
  "masque-hydratant-argan": { name: "Masque Hydratant Argan", tag: "INTENSE", price: 225, img: "Produit 1.jpg" },
  "shampooing-charbons": { name: "Shampooing Charbons", tag: "PURIFIANT", price: 185, img: "Produit 2.jpg" },
  "gloss-lavande": { name: "Gloss Lavande", tag: "BRILLANCE", price: 145, img: "Produit 3.jpg" },
  "soins-solaires": { name: "Soins Solaires", tag: "PROTECTION", price: 255, img: "Produit 4.jpg" },
  "huile-capillaire-cocotte": { name: "Huile Capillaire Cocotte", tag: "NOURRISTANT", price: 195, img: "Hero Produits.jpg.jpg" },
  "coiffant-eclat-karite": { name: "Coiffant Éclat Karité", tag: "BOUCLES", price: 165, img: "Produit 6.jpg" },
  "serum-reparateur": { name: "Sérum Réparateur", tag: "RÉPARATION", price: 210, img: "serum reparateur.jpg" },
  "baume-hydratant": { name: "Baume Hydratant", tag: "HYDRATATION", price: 175, img: "Image Produit 8.jpg" },
};

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS[slug];
  if (!product) notFound();

  return (
    <main className="page-main">
      <section className="products products-page">
        <div className="container container--product">
          <div className="product-page-layout">
            <div className="product-page-gallery">
              <div className="product-page-main-image" style={{ background: `url('/Images Sites Macrinère/${product.img}') center/cover` }} />
            </div>
            <div className="product-page-main">
              <h1 className="product-page-title">{product.name}</h1>
              <p className="product-tag">{product.tag}</p>
              <p className="product-page-price">{product.price} €</p>
              <p className="product-page-desc-short">Produit de soin capillaire Ma Crinière. Formule naturelle pour des cheveux sublimés.</p>
              <div className="product-page-actions">
                <AddToCartButton
                  productId={slug}
                  name={product.name}
                  price={product.price}
                  image={`/Images Sites Macrinère/${product.img}`}
                  className="btn btn-violet"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
