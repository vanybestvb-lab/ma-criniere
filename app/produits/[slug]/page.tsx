import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { fetchProductBySlug } from "@/lib/api";

const FALLBACK: Record<string, { name: string; tag: string; price: number; img: string }> = {
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
  const apiProduct = await fetchProductBySlug(slug);
  const fallback = FALLBACK[slug];

  if (!apiProduct && !fallback) notFound();

  if (apiProduct) {
    const img = apiProduct.images?.[0]?.url ?? "";
    const price = apiProduct.price ?? 0;
    return (
      <main className="page-main">
        <section className="products products-page">
          <div className="container container--product">
            <div className="product-page-layout">
              <div className="product-page-gallery">
                <div
                  className="product-page-main-image"
                  style={{ background: img ? `url('/${img}') center/cover` : undefined }}
                />
              </div>
              <div className="product-page-main">
                <h1 className="product-page-title">{apiProduct.name}</h1>
                <p className="product-tag">{apiProduct.tag ?? ""}</p>
                <p className="product-page-price">{price} €</p>
                <p className="product-page-desc-short">
                  {apiProduct.descriptionShort ?? "Produit de soin capillaire Ma Crinière. Formule naturelle pour des cheveux sublimés."}
                </p>
                <div className="product-page-actions">
                  <AddToCartButton
                    productId={apiProduct.slug}
                    name={apiProduct.name}
                    price={price}
                    image={img ? `/${img}` : ""}
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

  return (
    <main className="page-main">
      <section className="products products-page">
        <div className="container container--product">
          <div className="product-page-layout">
            <div className="product-page-gallery">
              <div
                className="product-page-main-image"
                style={{ background: `url('/images/${fallback.img}') center/cover` }}
              />
            </div>
            <div className="product-page-main">
              <h1 className="product-page-title">{fallback.name}</h1>
              <p className="product-tag">{fallback.tag}</p>
              <p className="product-page-price">{fallback.price} €</p>
              <p className="product-page-desc-short">
                Produit de soin capillaire Ma Crinière. Formule naturelle pour des cheveux sublimés.
              </p>
              <div className="product-page-actions">
                <AddToCartButton
                  productId={slug}
                  name={fallback.name}
                  price={fallback.price}
                  image={`/images/${fallback.img}`}
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
