import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN ?? "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const r = Math.random().toString(36).slice(-4).toUpperCase();
  return `MC${y}${m}${d}-${r}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      shippingOptionCode,
      paymentMethod,
    }: {
      customer: { firstName: string; lastName: string; email: string; phone?: string; address?: string };
      items: Array<{ productId?: string; name: string; sku?: string; price: number; quantity: number; subtotal: number }>;
      shippingOptionCode: string;
      paymentMethod: string;
    } = body;

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json(
        { error: "Données client incomplètes (email, prénom, nom requis)." },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide." },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (!shippingOptionCode) {
      return NextResponse.json(
        { error: "Option de livraison requise." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const zone = await prisma.shippingZone.findFirst({
      where: { code: shippingOptionCode, active: true },
    });
    if (!zone) {
      return NextResponse.json(
        { error: "Option de livraison invalide." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const shippingCost = zone.price;
    const total = subtotal + shippingCost;

    let customerRecord = await prisma.customer.findUnique({
      where: { email: customer.email.trim().toLowerCase() },
    });
    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          email: customer.email.trim().toLowerCase(),
          firstName: customer.firstName.trim(),
          lastName: customer.lastName.trim(),
          phone: customer.phone?.trim() ?? null,
          address: customer.address?.trim() ?? null,
        },
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerRecord!.id,
          email: customer.email.trim(),
          firstName: customer.firstName.trim(),
          lastName: customer.lastName.trim(),
          phone: customer.phone?.trim() ?? null,
          address: customer.address?.trim() ?? null,
          status: "PENDING",
          subtotal,
          shippingCost,
          discount: 0,
          total,
          currency: "USD",
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId || null,
          variantId: null,
          name: item.name,
          sku: item.sku ?? null,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: total,
          currency: "USD",
          status: "PENDING",
          method: paymentMethod || "livraison",
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: newOrder.id,
          status: "PENDING",
          message: "Commande créée depuis la boutique",
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      { orderId: order.id, orderNumber: order.orderNumber },
      { status: 201, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[API] POST /api/orders", e);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la commande." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
