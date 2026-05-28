import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as { ids?: string[] };
  const ids = body.ids?.filter(Boolean) ?? [];

  if (ids.length === 0) {
    return NextResponse.json({ success: true });
  }

  await prisma.adminNotification.updateMany({
    where: {
      id: { in: ids },
      userId: session.user.id,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
