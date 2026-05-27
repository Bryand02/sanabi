"use client";

import { useState } from "react";

export function ImageUploaderField({ initialUrls = [] }: { initialUrls?: string[] }) {
  const [urls, setUrls] = useState(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Cargar imágenes
        </label>
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={async (event) => {
            const files = event.target.files;
            if (!files?.length) {
              return;
            }

            setIsUploading(true);
            setError(null);

            const uploadForm = new FormData();
            Array.from(files).forEach((file) => uploadForm.append("files", file));

            const response = await fetch("/api/upload", {
              method: "POST",
              body: uploadForm,
            });
            const data = (await response.json()) as { urls?: string[]; error?: string };

            if (!response.ok || !data.urls) {
              setError(data.error ?? "No fue posible subir las imágenes.");
              setIsUploading(false);
              return;
            }

            setUrls((current) => [...current, ...data.urls!]);
            setIsUploading(false);
            event.target.value = "";
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
        />
        <p className="mt-2 text-xs text-slate-500">
          También puedes pegar URLs existentes si ya alojas las imágenes.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">URLs de imágenes</label>
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="flex gap-2">
            <input
              name="imageUrls"
              defaultValue={url}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
            <button
              type="button"
              onClick={() => setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-2xl border border-rose-200 px-4 py-3 text-rose-600"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setUrls((current) => [...current, ""])}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Agregar campo manual
        </button>
      </div>

      {isUploading ? <p className="text-sm text-slate-500">Subiendo imágenes...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
