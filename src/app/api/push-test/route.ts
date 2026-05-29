import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pushNotificationsConfigured, sendPushToSubscriptions } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!pushNotificationsConfigured()) {
    return NextResponse.json(
      { error: "El servidor aún no tiene configuradas las llaves push." },
      { status: 400 },
    );
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  if (subscriptions.length === 0) {
    return NextResponse.json(
      { error: "Este administrador todavía no tiene un dispositivo suscrito." },
      { status: 400 },
    );
  }

  const result = await sendPushToSubscriptions(subscriptions, {
    title: "Prueba de notificación",
    body: "Sanabi Kids ya puede enviar alertas a este dispositivo.",
    href: "/admin/pedidos",
  });

  if (result.sent === 0) {
    return NextResponse.json(
      { error: "No fue posible entregar la notificación de prueba." },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, sent: result.sent });
}
