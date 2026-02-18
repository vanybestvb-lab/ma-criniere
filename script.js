// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Newsletter : empêcher envoi par défaut (à brancher sur votre backend)
document.querySelector('.newsletter-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  if (email) {
    alert('Merci pour votre inscription ! Vous recevrez bientôt nos actualités.');
    this.reset();
  }
});

// Boutons "Ajouter au panier" (placeholder)
document.querySelectorAll('.product-add').forEach(btn => {
  btn.addEventListener('click', function () {
    const card = this.closest('.product-card');
    const name = card?.querySelector('h3')?.textContent || 'Produit';
    console.log('Ajout au panier:', name);
    // À connecter à votre logique panier
  });
});
