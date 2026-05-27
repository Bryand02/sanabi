import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const maxSize = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uploaded = await Promise.all(
    files.map(async (file) => {
      if (!allowedTypes.has(file.type)) {
        throw new Error("Formato de imagen no permitido.");
      }

      if (file.size > maxSize) {
        throw new Error("Cada imagen debe pesar menos de 4 MB.");
      }

      const extension = file.name.split(".").pop() || "png";
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, fileName), buffer);
      return `/uploads/${fileName}`;
    }),
  );

  return NextResponse.json({ urls: uploaded });
}
