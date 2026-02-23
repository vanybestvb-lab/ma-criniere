"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function confirmOrderPayment(formData: FormData): Promise<void> {
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) {
    redirect("/admin/orders?error=orderId_requis");
  }
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });
  if (!order || order.status !== "PENDING") {
    redirect(`/admin/orders/${orderId}?error=commande_invalide`);
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
}
