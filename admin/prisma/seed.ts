/**
 * Seed Ma Crinière — Données simulées pour le dashboard admin.
 * Idempotent : pas de doublons si exécuté plusieurs fois.
 * N'utilise que les modèles Prisma existants. Ne modifie pas le schéma.
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_ORDER_PREFIX = "MC-SEED-";

/** Pseudo-random déterministe pour reproductibilité */
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9999 + index * 12345) * 10000;
  return x - Math.floor(x);
}

function randomInRange(seed: number, index: number, min: number, max: number): number {
  return Math.floor(seededRandom(seed, index) * (max - min + 1)) + min;
}

const SEED = 42;

/** ~15–20 produits fictifs (données inline, pas de fichier externe) */
const MOCK_PRODUCTS: Array<{
  slug: string;
  name: string;
  descriptionShort: string;
  tag: string;
  price: number;
  currency: string;
  imageUrl: string;
}> = [
  { slug: "masque-hydratant-argan", name: "Masque Hydratant Argan", descriptionShort: "Masque à l'huile d'argan, nutrition intense.", tag: "INTENSE", price: 225, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Masque+Argan" },
  { slug: "shampooing-charbons", name: "Shampooing Charbons", descriptionShort: "Charbon actif, purifiant.", tag: "PURIFIANT", price: 185, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Shampooing" },
  { slug: "gloss-lavande", name: "Gloss Lavande", descriptionShort: "Brillance et légèreté à l'extrait de lavande.", tag: "BRILLANCE", price: 145, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Gloss" },
  { slug: "soins-solaires", name: "Soins Solaires", descriptionShort: "Spray protection UV et hydratation.", tag: "PROTECTION", price: 255, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Soins+Solaires" },
  { slug: "huile-capillaire-cocotte", name: "Huile Capillaire Cocotte", descriptionShort: "Blend argan, coco, jojoba.", tag: "NOURRISTANT", price: 195, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Huile" },
  { slug: "coiffant-eclat-karite", name: "Coiffant Éclat Karité", descriptionShort: "Beurre de karité, définition des boucles.", tag: "BOUCLES", price: 165, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Coiffant" },
  { slug: "serum-reparateur", name: "Sérum Réparateur", descriptionShort: "Kératine et actifs réparateurs.", tag: "RÉPARATION", price: 210, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Serum" },
  { slug: "baume-hydratant", name: "Baume Hydratant", descriptionShort: "Hydratation 24h sans rinçage.", tag: "HYDRATATION", price: 175, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Baume" },
  { slug: "after-shampooing-nourrissant", name: "After-Shampooing Nourrissant", descriptionShort: "Démêlage et gainage.", tag: "NOURRISTANT", price: 135, currency: "USD", imageUrl: "https://placehold.co/400x400?text=After" },
  { slug: "masque-keratine", name: "Masque Reconstructeur Kératine", descriptionShort: "Reconstruction en profondeur.", tag: "RÉPARATION", price: 245, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Masque+Keratine" },
  { slug: "huile-seche-eclat", name: "Huile Sèche Éclat", descriptionShort: "Fini satiné sans gras.", tag: "BRILLANCE", price: 155, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Huile+Seche" },
  { slug: "gel-coiffant-boucles", name: "Gel Coiffant Boucles", descriptionShort: "Fixation légère, définition.", tag: "BOUCLES", price: 125, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Gel" },
  { slug: "spray-thermoprotecteur", name: "Spray Thermoprotecteur", descriptionShort: "Protection jusqu'à 230°C.", tag: "PROTECTION", price: 165, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Spray" },
  { slug: "creme-jour-capillaire", name: "Crème de Jour Capillaire", descriptionShort: "Soin quotidien sans rinçage.", tag: "HYDRATATION", price: 145, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Creme" },
  { slug: "bain-huile-precipite", name: "Bain d'Huile Précipité", descriptionShort: "Soin pré-shampooing intense.", tag: "INTENSE", price: 215, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Bain+Huile" },
  { slug: "shampooing-antipelliculaire", name: "Shampooing Antipelliculaire", descriptionShort: "Cuir chevelu apaisé.", tag: "PURIFIANT", price: 175, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Antipelliculaire" },
  { slug: "mousse-volume", name: "Mousse Volume", descriptionShort: "Volume et tenue.", tag: "BOUCLES", price: 115, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Mousse" },
  { slug: "bandeau-satin-nuit", name: "Bandeau Satin Nuit", descriptionShort: "Satin pour éviter les frisottis.", tag: "ACCESSOIRES", price: 25, currency: "USD", imageUrl: "https://placehold.co/400x400?text=Bandeau" },
];

/** ~5–8 clients fictifs */
const MOCK_CUSTOMERS: Array<{ email: string; firstName: string; lastName: string; phone: string; address: string }> = [
  { email: "marie.dupont@email.com", firstName: "Marie", lastName: "Dupont", phone: "+33612345678", address: "12 rue de la Paix, Paris" },
  { email: "jean.martin@email.com", firstName: "Jean", lastName: "Martin", phone: "+33623456789", address: "5 av. des Lilas, Lyon" },
  { email: "sophie.bernard@email.com", firstName: "Sophie", lastName: "Bernard", phone: "+33634567890", address: "8 bd Gambetta, Marseille" },
  { email: "pierre.leroy@email.com", firstName: "Pierre", lastName: "Leroy", phone: "+33645678901", address: "3 rue Nationale, Lille" },
  { email: "claire.petit@email.com", firstName: "Claire", lastName: "Petit", phone: "+33656789012", address: "22 place du Marché, Toulouse" },
  { email: "luc.moreau@email.com", firstName: "Luc", lastName: "Moreau", phone: "+33667890123", address: "7 impasse des Roses, Bordeaux" },
  { email: "lea.simon@email.com", firstName: "Léa", lastName: "Simon", phone: "+33678901234", address: "15 rue Victor Hugo, Nantes" },
  { email: "thomas.laurent@email.com", firstName: "Thomas", lastName: "Laurent", phone: "+33689012345", address: "9 chemin Vert, Strasbourg" },
];

async function seedUser(): Promise<void> {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@ma-criniere.com" },
    create: {
      email: "admin@ma-criniere.com",
      passwordHash: hash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
    update: {},
  });
}

async function seedShippingZones(): Promise<void> {
  const zones = [
    { name: "Express 24h (70 km)", code: "express-24", price: 15, delay: "24h" },
    { name: "Express 48h", code: "express-48", price: 10, delay: "48h" },
    { name: "Standard", code: "standard", price: 5, delay: "48-72h" },
  ];
  for (const z of zones) {
    await prisma.shippingZone.upsert({
      where: { code: z.code },
      create: z,
      update: { name: z.name, price: z.price, delay: z.delay },
    });
  }
}

async function seedProducts(): Promise<string[]> {
  const productIds: string[] = [];
  for (let i = 0; i < MOCK_PRODUCTS.length; i++) {
    const p = MOCK_PRODUCTS[i];
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        descriptionShort: p.descriptionShort,
        tag: p.tag,
        price: p.price,
        currency: p.currency,
        active: true,
        sortOrder: i,
      },
      update: {
        name: p.name,
        descriptionShort: p.descriptionShort,
        tag: p.tag,
        price: p.price,
        currency: p.currency,
        active: true,
      },
    });
    productIds.push(product.id);
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.imageUrl,
          alt: p.name,
          sortOrder: 0,
        },
      });
    }
  }
  return productIds;
}

async function seedInventory(productIds: string[]): Promise<void> {
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const stockOnHand = randomInRange(SEED, i * 2, 10, 80);
    const lowStockThreshold = 10;
    await prisma.inventoryLevel.upsert({
      where: { productId },
      create: {
        productId,
        quantity: stockOnHand,
        stockReserved: 0,
        alertThreshold: lowStockThreshold,
      },
      update: {
        quantity: stockOnHand,
        alertThreshold: lowStockThreshold,
      },
    });
  }
}

async function seedCustomers(): Promise<string[]> {
  const ids: string[] = [];
  for (const c of MOCK_CUSTOMERS) {
    const cust = await prisma.customer.upsert({
      where: { email: c.email },
      create: {
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        address: c.address,
      },
      update: {},
    });
    ids.push(cust.id);
  }
  return ids;
}

const ORDER_STATUSES = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

/** Livraison cohérente avec la commande : annulée si commande annulée, livrée si commande livrée, etc. */
function shipmentStatusForOrder(orderStatus: string): "PENDING" | "PICKED" | "IN_TRANSIT" | "DELIVERED" {
  switch (orderStatus) {
    case "CANCELLED":
    case "PENDING":
      return "PENDING";
    case "PAID":
    case "PREPARING":
      return "PICKED";
    case "SHIPPED":
      return "IN_TRANSIT";
    case "DELIVERED":
      return "DELIVERED";
    default:
      return "PENDING";
  }
}

async function seedOrders(productIds: string[], customerIds: string[]): Promise<void> {
  const existingSeedOrders = await prisma.order.count({
    where: { orderNumber: { startsWith: SEED_ORDER_PREFIX } },
  });
  const targetCount = 10;
  if (existingSeedOrders >= targetCount) {
    return;
  }

  const shippingCost = 10;
  const currency = "USD";

  for (let o = 0; o < targetCount; o++) {
    const orderNumber = `${SEED_ORDER_PREFIX}${String(o + 1).padStart(3, "0")}`;
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (existingOrder) continue;

    const customerIndex = o % customerIds.length;
    const cust = await prisma.customer.findUnique({
      where: { id: customerIds[customerIndex] },
    });
    if (!cust) continue;

    const statusIndex = randomInRange(SEED, 4000 + o, 0, ORDER_STATUSES.length - 1);
    const status = ORDER_STATUSES[statusIndex];

    const numItems = randomInRange(SEED, 1000 + o, 1, 4);
    let subtotal = 0;
    const orderItemsData: Array<{ productId: string; name: string; price: number; quantity: number; subtotal: number }> = [];
    const usedIndexes = new Set<number>();

    for (let j = 0; j < numItems; j++) {
      let idx = randomInRange(SEED, 2000 + o * 10 + j, 0, productIds.length - 1);
      while (usedIndexes.has(idx)) idx = (idx + 1) % productIds.length;
      usedIndexes.add(idx);

      const product = await prisma.product.findUnique({
        where: { id: productIds[idx] },
      });
      if (!product || product.price == null) continue;

      const qty = randomInRange(SEED, 3000 + o * 10 + j, 1, 3);
      const unitPrice = product.price;
      const lineSubtotal = Math.round(unitPrice * qty * 100) / 100;
      subtotal += lineSubtotal;
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: qty,
        subtotal: lineSubtotal,
      });
    }

    if (orderItemsData.length === 0) continue;

    const total = Math.round((subtotal + shippingCost) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: cust.id,
        email: cust.email,
        firstName: cust.firstName,
        lastName: cust.lastName,
        phone: cust.phone,
        address: cust.address,
        status,
        subtotal,
        shippingCost,
        discount: 0,
        total,
        currency,
      },
    });

    for (const item of orderItemsData) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        },
      });
    }

    const shipStatus = shipmentStatusForOrder(status);
    const trackingCode = shipStatus !== "PENDING" ? `MC-TRK-${orderNumber}` : null;
    const deliveredAt = shipStatus === "DELIVERED"
      ? new Date(Date.now() - randomInRange(SEED, 6000 + o, 1, 10) * 24 * 60 * 60 * 1000)
      : null;
    const shippedAt = shipStatus !== "PENDING" ? new Date(Date.now() - randomInRange(SEED, 7000 + o, 1, 5) * 24 * 60 * 60 * 1000) : null;

    await prisma.shipment.create({
      data: {
        orderId: order.id,
        status: shipStatus,
        trackingNumber: trackingCode,
        address: cust.address ?? undefined,
        deliveredAt,
        shippedAt,
      },
    });

    const paymentStatus = status === "CANCELLED" || status === "PENDING" ? "PENDING" : "SUCCESS";
    const paidAt = paymentStatus === "SUCCESS" ? new Date() : null;

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        currency,
        status: paymentStatus,
        method: "livraison",
        paidAt,
      },
    });

    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status,
        message: status === "CANCELLED" ? "Commande annulée (non aboutie)" : "Commande créée (seed)",
      },
    });
  }
}

async function main(): Promise<void> {
  await seedUser();
  await seedShippingZones();

  const productIds = await seedProducts();
  if (productIds.length === 0) {
    console.log("Seed: aucun produit traité.");
  } else {
    await seedInventory(productIds);
  }

  const customerIds = await seedCustomers();
  await seedOrders(productIds, customerIds);

  console.log("Seed terminé : user, zones, produits, stock, clients, commandes et livraisons.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
