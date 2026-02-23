"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCartItems,
  getCartTotal,
  setQuantity,
  removeFromCart,
  type CartItem,
} from "@/lib/cart";

function formatPrice(price: number): string {
  return `${price} €`;
}

export function PanierClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const refresh = () => {
    setItems(getCartItems());
    setTotal(getCartTotal());
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const handleQty = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    setQuantity(productId, item.quantity + delta);
  };

  const isEmpty = items.length === 0;

  return (
    <main className="page-main">
      <section className="products products-page" style={{ paddingTop: "2rem" }}>
        <div className="container" data-cart-root>
          <div className="cart-header">
            <h1 className="section-title-maskin">
              Votre <span className="section-title-maskin--script">panier</span>
            </h1>
            <Link href="/produits" className="btn btn-violet">
              Continuer mes achats
            </Link>
          </div>

          {isEmpty && (
            <div className="cart-empty">
              <p>Votre panier est vide.</p>
              <Link href="/produits" className="btn btn-violet">
                Découvrir nos produits
              </Link>
            </div>
          )}

          {!isEmpty && (
            <div className="cart-table-wrap" data-cart-table-wrap>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Désignation</th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Sous-total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody data-cart-table-body>
                  {items.map((item) => (
                    <tr key={item.productId} data-product-id={item.productId}>
                      <td>
                        <div
                          className="cart-item-image"
                          style={{
                            backgroundImage: `url('${item.image.startsWith("/") ? item.image : `/${item.image}`}')`,
                          }}
                          role="img"
                          aria-label={item.name}
                        />
                      </td>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>
                        <div className="cart-qty-wrap">
                          <button
                            type="button"
                            aria-label="Diminuer"
                            onClick={() => handleQty(item.productId, -1)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Augmenter"
                            onClick={() => handleQty(item.productId, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <strong>{formatPrice(item.subtotal)}</strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="cart-remove"
                          aria-label="Retirer du panier"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Retirer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Total</span>
                  <span data-cart-total>{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="btn btn-violet"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "1rem",
                  }}
                >
                  Commander
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
