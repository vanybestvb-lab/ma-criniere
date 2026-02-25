import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "@/components/CartBadge";

const IMG = "/images";

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <Image
            src={`${IMG}/Logo Ma Crinière Violet.png`}
            alt="Ma Crinière"
            className="logo-img"
            width={160}
            height={48}
            unoptimized
          />
        </Link>
        <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-hidden hidden />
        <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Ouvrir le menu">
          <span /><span /><span />
        </label>
        <nav className="nav nav-desktop">
          <Link href="/">ACCUEIL</Link>
          <Link href="/a-propos">À PROPOS</Link>
          <Link href="/produits">PRODUITS</Link>
        </nav>
        <div className="mobile-menu-panel" id="mobile-menu">
          <Image
            src={`${IMG}/Logo Ma Crinière Violet.png`}
            alt="Ma Crinière"
            className="mobile-menu-logo"
            width={120}
            height={36}
            unoptimized
          />
          <nav className="nav nav-mobile">
            <Link href="/">Accueil</Link>
            <Link href="/produits">Boutique</Link>
          </nav>
        </div>
        <Link href="/panier" className="header-cart-icon" aria-label="Panier">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor" /></svg>
          <CartBadge />
        </Link>
        <Link href="/#contact" className="btn btn-contact">CONTACT</Link>
      </div>
    </header>
  );
}
