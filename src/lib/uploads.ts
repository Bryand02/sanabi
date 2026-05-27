import { unlink } from "node:fs/promises";
import path from "node:path";

function isLocalUpload(url: string) {
  return url.startsWith("/uploads/");
}

function toAbsoluteUploadPath(url: string) {
  const relativePath = url.replace(/^\//, "");
  return path.join(process.cwd(), "public", relativePath);
}

export async function deleteUploadedFiles(urls: string[]) {
  await Promise.all(
    urls
      .filter(isLocalUpload)
      .map(async (url) => {
        try {
          await unlink(toAbsoluteUploadPath(url));
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
