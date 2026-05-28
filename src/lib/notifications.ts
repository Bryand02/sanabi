import webpush from "web-push";
import { prisma } from "@/lib/prisma";

type PushPayload = {
  title: string;
  body: string;
  href?: string;
};

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY;
const vapidSubject = process.env.WEB_PUSH_SUBJECT;

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export function pushNotificationsConfigured() {
  return Boolean(vapidPublicKey && vapidPrivateKey && vapidSubject);
}

export function getPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

export async function createAdminOrderNotifications(input: {
  orderNumber: string;
  customerName: string;
  total: number;
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { pushSubscriptions: true },
  });

  if (admins.length === 0) {
    return;
  }

  const title = "Nueva compra en Sanabi Kids";
  const body = `${input.customerName} realizó el pedido ${input.orderNumber}. Total: ${new Intl.NumberFormat(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    },
  ).format(input.total)}.`;
  const href = "/admin/pedidos";

  await prisma.adminNotification.createMany({
    data: admins.map((admin) => ({
      title,
      body,
      href,
      userId: admin.id,
    })),
  });

  if (!pushNotificationsConfigured()) {
    return;
  }

  const payload = JSON.stringify({ title, body, href } satisfies PushPayload);

  await Promise.all(
    admins.flatMap((admin) =>
      admin.pushSubscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload,
          );
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            (error.statusCode === 404 || error.statusCode === 410)
          ) {
            await prisma.pushSubscription.delete({ where: { id: subscription.id } });
          }
        }
      }),
    ),
  );
}
