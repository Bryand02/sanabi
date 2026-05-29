import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pushNotificationsConfigured } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

type PushSubscriptionBody = {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!pushNotificationsConfigured()) {
    return NextResponse.json(
      { error: "El servidor todavía no tiene habilitadas las llaves push." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as PushSubscriptionBody;

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "Suscripción incompleta." }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: body.endpoint },
    update: {
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      userId: session.user.id,
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
    create: {
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      userId: session.user.id,
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as { endpoint?: string };

  if (!body.endpoint) {
    return NextResponse.json({ error: "Endpoint requerido." }, { status: 400 });
  }

  await prisma.pushSubscription.deleteMany({
    where: {
      endpoint: body.endpoint,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
