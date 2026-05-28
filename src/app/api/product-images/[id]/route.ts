import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const image = await prisma.productImage.findUnique({
    where: { id },
    select: {
      url: true,
      mimeType: true,
      fileName: true,
      data: true,
    },
  });

  if (!image) {
    return new NextResponse("Imagen no encontrada.", { status: 404 });
  }

  if (!image.data) {
    if (image.url && !image.url.startsWith("/api/product-images/")) {
      return NextResponse.redirect(new URL(image.url, request.url));
    }

    return new NextResponse("Imagen no disponible.", { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.mimeType ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${image.fileName ?? `${id}.bin`}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
