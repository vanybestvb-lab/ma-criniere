import Link from "next/link";
import Image from "next/image";

const IMG = "/Images Sites Macrinère";

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image
            src={`${IMG}/Logo Ma Crinière.png`}
            alt="Ma Crinière"
            className="footer-logo-img"
            width={120}
            height={40}
            unoptimized
          />
          <p>Votre boutique spécialisée de créations & d&apos;idées. Des extraits précieux pour sublimer votre projet de rêve.</p>
          <p className="footer-copy">© 2024 Ma Crinière. Tous droits réservés.</p>
        </div>
        <div className="footer-col">
          <h4>NAVIGATION</h4>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/produits">Produits</Link></li>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>INFORMATIONS</h4>
          <ul>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><a href="#">Livraison</a></li>
            <li><a href="#">Retours</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>CONTACT</h4>
          <p className="footer-contact">📍 ADRESSE<br />21 Avenue D.A.P.L.<br />Germano de Giramio</p>
          <p className="footer-contact">📞 CONTACTER<br />+33 2 87 84 71 280</p>
          <p className="footer-contact">📷 RÉSEAUX SOCIAUX<br />@ma_criniere</p>
        </div>
      </div>
    </footer>
  );
}
