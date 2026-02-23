"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCartItems, getCartTotal, clearCart } from "@/lib/cart";
import { createOrder, type ShippingOption, type OrderItem, type Customer } from "@/lib/orders";

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "express-24", label: "Livraison express 24h (70 km)", price: 15, delay: "24h" },
  { id: "express-48", label: "Livraison express 48h", price: 10, delay: "48h" },
  { id: "standard", label: "Livraison standard", price: 5, delay: "48-72h" },
];

function formatPrice(price: number): string {
  return `${price} €`;
}

export function CheckoutClient() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [payment, setPayment] = useState("mobile_money");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const shippingCost = shipping.price;
  const total = subtotal + shippingCost;

  useEffect(() => {
    const cartItems = getCartItems();
    const tot = getCartTotal();
    setItems(cartItems.map((i) => ({ ...i })));
    setSubtotal(tot);
  }, []);

  const isEmpty = items.length === 0;

  const toOrderItems = (): OrderItem[] =>
    getCartItems().map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      subtotal: i.subtotal,
    }));

  const captureCustomer = (): boolean => {
    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return false;
    }
    const fd = new FormData(form);
    setCustomer({
      firstName: (fd.get("prenom") as string)?.trim() ?? "",
      lastName: (fd.get("nom") as string)?.trim() ?? "",
      email: (fd.get("email") as string)?.trim() ?? "",
      phone: (fd.get("tel") as string)?.trim() ?? "",
      address: (fd.get("adresse") as string)?.trim() ?? "",
    });
    return true;
  };

  const handleConfirmOrder = () => {
    if (!customer.email) {
      setStep(2);
      return;
    }
    const orderItems = toOrderItems();
    const order = createOrder(customer, orderItems, shipping, payment);
    clearCart();
    setOrderId(order.id);
    setStep(5);
  };

  if (isEmpty && step < 5) {
    return (
      <main className="page-main">
        <section className="commande-form-section" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
          <div className="container container--form">
            <h1 className="section-title-maskin">Commande</h1>
            <p className="section-desc">Votre panier est vide.</p>
            <Link href="/panier" className="btn btn-hero-maskin">Retour au panier</Link>
            <Link href="/produits" className="btn btn-violet" style={{ marginLeft: "1rem" }}>Voir les produits</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-main">
      <section className="commande-form-section" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container container--form">
          <h1 className="section-title-maskin" style={{ marginBottom: "1.5rem" }}>
            Commande
          </h1>

          <div className="checkout-steps" role="tablist" aria-label="Étapes de la commande">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={`checkout-step ${step === s ? "active" : ""} ${step > s ? "done" : ""}`}
                onClick={() => setStep(s)}
                aria-selected={step === s}
              >
                <span className="checkout-step-num">{s}</span>
                <span className="checkout-step-label">
                  {s === 1 && "Panier"}
                  {s === 2 && "Infos client"}
                  {s === 3 && "Livraison"}
                  {s === 4 && "Paiement"}
                  {s === 5 && "Confirmation"}
                </span>
              </button>
            ))}
          </div>

          {/* Étape 1 : Récap panier */}
          {step === 1 && (
            <div className="checkout-panel active">
              <div className="checkout-cart-recap">
                <ul className="cart-recap-list">
                  {items.map((i) => (
                    <li key={i.productId}>
                      {i.name} × {i.quantity} — {formatPrice(i.subtotal)}
                    </li>
                  ))}
                </ul>
                <p><strong>Sous-total : {formatPrice(subtotal)}</strong></p>
              </div>
              <div className="checkout-actions">
                <Link href="/panier" className="btn btn-hero-maskin">← Retour au panier</Link>
                <button type="button" className="btn btn-violet" onClick={() => setStep(2)}>
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 2 : Infos client */}
          {step === 2 && (
            <div className="checkout-panel active">
              <form ref={formRef} className="form-commande" id="checkout-form" noValidate
                onSubmit={(e) => { e.preventDefault(); if (captureCustomer()) setStep(3); }}
              >
                <div className="form-row form-row--double">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom <span className="required">*</span></label>
                    <input type="text" id="prenom" name="prenom" required placeholder="Votre prénom" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom <span className="required">*</span></label>
                    <input type="text" id="nom" name="nom" required placeholder="Votre nom" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input type="email" id="email" name="email" required placeholder="exemple@email.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tel">Téléphone <span className="required">*</span></label>
                    <input type="tel" id="tel" name="tel" required placeholder="+243 XXX XXX XXX" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="adresse">Adresse de livraison <span className="required">*</span></label>
                    <textarea id="adresse" name="adresse" rows={3} required placeholder="Adresse complète, commune, ville" />
                  </div>
                </div>
              </form>
              <div className="checkout-actions">
                <button type="button" className="btn btn-hero-maskin" onClick={() => setStep(1)}>← Précédent</button>
                <button type="button" className="btn btn-violet" onClick={() => captureCustomer() && setStep(3)}>Suivant</button>
              </div>
            </div>
          )}

          {/* Étape 3 : Livraison */}
          {step === 3 && (
            <div className="checkout-panel active">
              <h3 className="checkout-panel-title">Choisissez une option de livraison</h3>
              <div className="shipping-options">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`shipping-option ${shipping.id === opt.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shipping.id === opt.id}
                      onChange={() => setShipping(opt)}
                    />
                    <span>{opt.label}</span>
                    <strong>{formatPrice(opt.price)}</strong> — {opt.delay}
                  </label>
                ))}
              </div>
              <div className="checkout-actions">
                <button type="button" className="btn btn-hero-maskin" onClick={() => setStep(2)}>← Précédent</button>
                <button type="button" className="btn btn-violet" onClick={() => setStep(4)}>Suivant</button>
              </div>
            </div>
          )}

          {/* Étape 4 : Paiement */}
          {step === 4 && (
            <div className="checkout-panel active">
              <h3 className="checkout-panel-title">Mode de paiement</h3>
              <div className="payment-options">
                <label className={`payment-option ${payment === "mobile_money" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="mobile_money" checked={payment === "mobile_money"} onChange={() => setPayment("mobile_money")} />
                  <span>Mobile Money</span>
                </label>
                <label className={`payment-option ${payment === "carte" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="carte" checked={payment === "carte"} onChange={() => setPayment("carte")} />
                  <span>Carte bancaire</span>
                </label>
                <label className={`payment-option ${payment === "livraison" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="livraison" checked={payment === "livraison"} onChange={() => setPayment("livraison")} />
                  <span>Paiement à la livraison</span>
                </label>
              </div>
              <div className="checkout-summary-box" style={{ marginTop: "1.5rem" }}>
                <h3>Récapitulatif</h3>
                <p>Sous-total : <strong data-summary-subtotal>{formatPrice(subtotal)}</strong></p>
                <p>Livraison : <strong data-summary-shipping>{formatPrice(shippingCost)}</strong></p>
                <p>Total : <strong data-summary-total>{formatPrice(total)}</strong></p>
              </div>
              <div className="checkout-actions">
                <button type="button" className="btn btn-hero-maskin" onClick={() => setStep(3)}>← Précédent</button>
                <button type="button" className="btn btn-violet btn-submit" onClick={handleConfirmOrder}>
                  Confirmer la commande
                </button>
              </div>
            </div>
          )}

          {/* Étape 5 : Confirmation */}
          {step === 5 && orderId && (
            <div className="checkout-panel active">
              <div className="confirmation-box">
                <h2>Merci pour votre commande !</h2>
                <p>Numéro de commande : <span className="order-id">{orderId}</span></p>
                <p>Nous vous recontacterons par téléphone ou email pour finaliser la livraison.</p>
              </div>
              <Link href="/produits" className="btn btn-violet">Retour à la boutique</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
