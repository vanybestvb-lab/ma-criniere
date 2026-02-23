"use client";

import { useTransition } from "react";
import { addToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  className = "btn btn-violet",
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(() => {
      addToCart({
        productId,
        name,
        price,
        image: image.startsWith("/") ? image : `/${image}`,
      });
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleAdd}
      disabled={isPending}
    >
      {isPending ? "Ajout…" : "Ajouter au panier"}
    </button>
  );
}
