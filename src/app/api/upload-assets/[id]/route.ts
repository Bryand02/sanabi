import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const asset = await prisma.uploadAsset.findUnique({
    where: { id },
    select: {
      mimeType: true,
      fileName: true,
      data: true,
    },
  });

  if (!asset) {
    return new NextResponse("Carga no encontrada.", { status: 404 });
  }

  return new NextResponse(asset.data, {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Disposition": `inline; filename="${asset.fileName ?? `${id}.bin`}"`,
      "Cache-Control": "no-store",
    },
  });
}
