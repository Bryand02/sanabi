import { mkdir, rename, rmdir, unlink } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/utils";

function isLocalUpload(url: string) {
  return url.startsWith("/uploads/");
}

function toAbsoluteUploadPath(url: string) {
  const relativePath = url.replace(/^\//, "");
  return path.join(process.cwd(), "public", relativePath);
}

function toPublicUploadUrl(absolutePath: string) {
  const uploadsRoot = path.join(process.cwd(), "public");
  return absolutePath.replace(uploadsRoot, "").replaceAll(path.sep, "/");
}

function getExtension(filePath: string) {
  return path.extname(filePath) || ".jpg";
}

async function deleteIfEmpty(directoryPath: string) {
  try {
    await rmdir(directoryPath);
  } catch {
    // Ignoramos directorios no vacíos o inexistentes.
  }
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

  await deleteUploadedFiles(candidateUrls);
}

export async function moveImagesToProductFolder(urls: string[], productName: string) {
  const productSlug = slugify(productName);
  const productFolder = path.join(process.cwd(), "public", "uploads", productSlug);

  await mkdir(productFolder, { recursive: true });

  const normalizedUrls = await Promise.all(
    urls.map(async (url, index) => {
      if (!isLocalUpload(url)) {
        return url;
      }

      const absoluteSource = toAbsoluteUploadPath(url);
      const currentFolder = path.dirname(absoluteSource);
      const extension = getExtension(absoluteSource);
      const nextFileName = `${productSlug}-${index + 1}-${crypto.randomUUID()}${extension}`;
      const absoluteTarget = path.join(productFolder, nextFileName);

      if (absoluteSource !== absoluteTarget) {
        await mkdir(path.dirname(absoluteTarget), { recursive: true });
        await rename(absoluteSource, absoluteTarget);
        if (currentFolder !== productFolder) {
          await deleteIfEmpty(currentFolder);
        }
      }

      return toPublicUploadUrl(absoluteTarget);
    }),
  );

  return normalizedUrls;
}
