"use client";

import Image from "next/image";
import { Camera, Grip, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

type UploadResponse = {
  urls?: string[];
  error?: string;
};

export function ImageUploaderField({ initialUrls = [] }: { initialUrls?: string[] }) {
  const [urls, setUrls] = useState(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setIsUploading(true);
    setError(null);

    const uploadForm = new FormData();
    Array.from(fileList).forEach((file) => uploadForm.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm,
    });

    const data = (await response.json()) as UploadResponse;

    if (!response.ok || !data.urls) {
      setError(data.error ?? "No fue posible subir las imágenes.");
      setIsUploading(false);
      return;
    }

    setUrls((current) => [...current, ...(data.urls ?? [])]);
    setIsUploading(false);
  }

  function removeUrl(index: number) {
    setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveUrl(index: number, direction: "left" | "right") {
    setUrls((current) => {
      const nextIndex = direction === "left" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-dashed border-[var(--color-stroke)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,251,255,0.92))] p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="block text-base font-semibold text-slate-800">
              Fotos de la prenda
            </label>
            <p className="mt-1 text-sm text-slate-500">
              Sube varias fotos desde la galería o toma una con la cámara.
            </p>
          </div>
          <div className="rounded-full bg-[var(--color-cloud)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-ink)]">
            La primera foto será la portada
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex min-h-14 items-center justify-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-left font-semibold text-slate-800 shadow-sm"
          >
            <ImagePlus className="h-5 w-5 text-[var(--color-primary)]" />
            <span>Subir desde galería</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex min-h-14 items-center justify-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-left font-semibold text-slate-800 shadow-sm"
          >
            <Camera className="h-5 w-5 text-[var(--color-primary)]" />
            <span>Abrir cámara</span>
          </button>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={async (event) => {
            await uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          capture="environment"
          className="hidden"
          onChange={async (event) => {
            await uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {isUploading ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-cloud)] px-4 py-2 text-sm font-medium text-[var(--color-primary-ink)]">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Subiendo imágenes...
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-700">Vista previa</label>
          <p className="text-xs text-slate-500">Toca las flechas para cambiar el orden</p>
        </div>

        {urls.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Aún no has agregado fotos.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {urls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/5] bg-slate-100">
                  <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                    {index === 0 ? "Portada" : `Foto ${index + 1}`}
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  <input type="hidden" name="imageUrls" value={url} />
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    {url}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveUrl(index, "left")}
                      disabled={index === 0}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveUrl(index, "right")}
                      disabled={index === urls.length - 1}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[1.5rem] bg-[var(--color-cloud)] px-4 py-3 text-sm text-[var(--color-primary-ink)]">
        <div className="flex items-start gap-3">
          <Grip className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            En celular puedes tocar <strong>Abrir cámara</strong> para tomar la foto en el momento.
            En computador o móvil también puedes usar <strong>Subir desde galería</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
