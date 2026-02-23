"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function confirmOrderPayment(formData: FormData) {
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) {
    return { ok: false, error: "orderId requis" };
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });
  if (!order || order.status !== "PENDING") {
    return { ok: false, error: "Commande introuvable ou déjà traitée" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        status: "PAID",
        message: "Paiement confirmé manuellement (admin)",
      },
    });
    await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });
    const payment = order.payments[0];
    if (payment) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", paidAt: new Date() },
      });
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
