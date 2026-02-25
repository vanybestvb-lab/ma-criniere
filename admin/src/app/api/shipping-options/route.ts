import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN ?? "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        delay: true,
      },
    });
    const options = zones.map((z) => ({
      id: z.code,
      label: z.name,
      price: z.price,
      delay: z.delay ?? "",
    }));
    return NextResponse.json(options, {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[API] GET /api/shipping-options", e);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
