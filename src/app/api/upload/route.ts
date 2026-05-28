import sharp from "sharp";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
]);

const maxSize = 20 * 1024 * 1024;

function sanitizeBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "imagen";
}

async function normalizeBuffer(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "image/svg+xml") {
    return {
      buffer,
      extension: "svg",
    };
  }

  const normalized = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 88 })
    .toBuffer();

  return {
    buffer: normalized,
    extension: "webp",
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 });
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        if (!allowedTypes.has(file.type)) {
          throw new Error(
            "Formato no permitido. Usa fotos desde celular o imágenes JPG, PNG, WEBP, HEIC o AVIF.",
          );
        }

        if (file.size > maxSize) {
          throw new Error("Cada imagen debe pesar menos de 20 MB.");
        }

        const { buffer, extension } = await normalizeBuffer(file);
        const safeName = sanitizeBaseName(file.name);
        const fileName = `${safeName}-${crypto.randomUUID()}.${extension}`;
        const asset = await prisma.uploadAsset.create({
          data: {
            mimeType: file.type === "image/svg+xml" ? "image/svg+xml" : `image/${extension}`,
            fileName,
            data: new Uint8Array(
              buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
            ) as Uint8Array<ArrayBuffer>,
          },
          select: { id: true },
        });

        return `/api/upload-assets/${asset.id}`;
      }),
    );

    return NextResponse.json({ urls: uploaded });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible procesar las imágenes seleccionadas.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
