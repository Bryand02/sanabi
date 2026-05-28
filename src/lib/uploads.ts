import { readFile, rmdir, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

function isLocalUpload(url: string) {
  return url.startsWith("/uploads/");
}

function isTemporaryUpload(url: string) {
  return url.startsWith("/api/upload-assets/");
}

function isStoredProductImage(url: string) {
  return url.startsWith("/api/product-images/");
}

function getAssetIdFromUrl(url: string) {
  return url.split("/").pop() ?? "";
}

function getProductImageIdFromUrl(url: string) {
  return url.split("/").pop() ?? "";
}

function toAbsoluteUploadPath(url: string) {
  const relativePath = url.replace(/^\//, "");
  return path.join(process.cwd(), "public", relativePath);
}

function getMimeTypeFromExtension(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".heic":
      return "image/heic";
    case ".heif":
      return "image/heif";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".tif":
    case ".tiff":
      return "image/tiff";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function deleteIfEmpty(directoryPath: string) {
  try {
    await rmdir(directoryPath);
  } catch {
    // Ignoramos directorios no vacíos o inexistentes.
  }
}

async function deleteTemporaryUploadAssets(urls: string[]) {
  const ids = urls
    .filter(isTemporaryUpload)
    .map(getAssetIdFromUrl)
    .filter(Boolean);

  if (ids.length === 0) {
    return;
  }

  await prisma.uploadAsset.deleteMany({
    where: { id: { in: ids } },
  });
}

export async function deleteUploadedFiles(urls: string[]) {
  await Promise.all(
    urls
      .filter(isLocalUpload)
      .map(async (url) => {
        try {
          const absolutePath = toAbsoluteUploadPath(url);
          await unlink(absolutePath);
          await deleteIfEmpty(path.dirname(absolutePath));
        } catch {
          // Ignoramos archivos ya eliminados o no encontrados.
        }
      }),
  );
}

export async function cleanupUnusedUploadUrls(candidateUrls: string[]) {
  if (candidateUrls.length === 0) {
    return;
  }

  await Promise.all([
    deleteUploadedFiles(candidateUrls),
    deleteTemporaryUploadAssets(candidateUrls),
  ]);
}

type PreparedProductImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
  mimeType: string | null;
  fileName: string | null;
  data?: Uint8Array<ArrayBuffer>;
};

async function prepareImageFromLocalUpload(url: string, productName: string, index: number) {
  const absolutePath = toAbsoluteUploadPath(url);
  const fileBuffer = await readFile(absolutePath);
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength,
  ) as ArrayBuffer;
  const data = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
  const id = crypto.randomUUID();
  const fileName = path.basename(absolutePath);

  await unlink(absolutePath);
  await deleteIfEmpty(path.dirname(absolutePath));

  return {
    id,
    url: `/api/product-images/${id}`,
    alt: productName,
    position: index,
    mimeType: getMimeTypeFromExtension(absolutePath),
    fileName,
    data,
  } satisfies PreparedProductImage;
}

async function prepareImageFromUploadAsset(url: string, productName: string, index: number) {
  const assetId = getAssetIdFromUrl(url);
  const asset = await prisma.uploadAsset.findUnique({
    where: { id: assetId },
    select: {
      mimeType: true,
      fileName: true,
      data: true,
    },
  });

  if (!asset) {
    throw new Error("Una de las imágenes temporales ya no está disponible. Súbela nuevamente.");
  }

  return {
    id: crypto.randomUUID(),
    url: `/api/product-images/${crypto.randomUUID()}`,
    alt: productName,
    position: index,
    mimeType: asset.mimeType,
    fileName: asset.fileName,
    data: asset.data as Uint8Array<ArrayBuffer>,
  } satisfies PreparedProductImage;
}

export async function prepareProductImagesForDatabase(urls: string[], productName: string) {
  const prepared = await Promise.all(
    urls.map(async (url, index): Promise<PreparedProductImage> => {
      if (isTemporaryUpload(url)) {
        return prepareImageFromUploadAsset(url, productName, index);
      }

      if (isLocalUpload(url)) {
        return prepareImageFromLocalUpload(url, productName, index);
      }

      if (isStoredProductImage(url)) {
        const imageId = getProductImageIdFromUrl(url);

        return {
          id: imageId,
          url,
          alt: productName,
          position: index,
          mimeType: null,
          fileName: null,
        };
      }

      return {
        id: crypto.randomUUID(),
        url,
        alt: productName,
        position: index,
        mimeType: null,
        fileName: null,
      };
    }),
  );

  await deleteTemporaryUploadAssets(urls);

  return prepared.map((image) =>
    image.url.startsWith("/api/product-images/") && image.data
      ? { ...image, url: `/api/product-images/${image.id}` }
      : image,
  );
}
