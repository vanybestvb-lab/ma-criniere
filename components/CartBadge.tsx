"use client";

import { useState, useEffect } from "react";
import { getCartCount } from "@/lib/cart";

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const onUpdate = () => setCount(getCartCount());
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  if (count === 0) return null;
  return (
    <span className="cart-badge" aria-label={`${count} article(s) au panier`}>
      {count}
    </span>
  );
}
