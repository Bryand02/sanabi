import { productCategories, productGenders, productSizes } from "@/lib/constants";
import { ImageUploaderField } from "@/components/admin/image-uploader-field";

type ProductFormValues = {
  name?: string;
  description?: string;
  size?: string;
  gender?: string | null;
  category?: string;
  condition?: "NEW" | "PRELOVED";
  price?: number;
  stock?: number;
  featured?: boolean;
  imageUrls?: string[];
};

export function ProductForm({
  action,
  submitLabel,
  values,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  values?: ProductFormValues;
}) {
  return (
    <form action={action} className="space-y-6 rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
          <input
            name="name"
            defaultValue={values?.name}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            name="description"
            rows={5}
            defaultValue={values?.description}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Talla</label>
          <select
            name="size"
            defaultValue={values?.size}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Selecciona</option>
            {productSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Categoría</label>
          <select
            name="category"
            defaultValue={values?.category}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">Selecciona</option>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Género</label>
          <select
            name="gender"
            defaultValue={values?.gender ?? ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">No especificar</option>
            {productGenders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Estado</label>
          <select
            name="condition"
            defaultValue={values?.condition}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="NEW">Nuevo</option>
            <option value="PRELOVED">Segunda mano</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Precio</label>
          <input
            type="number"
            name="price"
            defaultValue={values?.price}
            min={0}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Inventario</label>
          <input
            type="number"
            name="stock"
            defaultValue={values?.stock}
            min={0}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>
        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={values?.featured} />
          Destacar en inicio
        </label>
      </div>

      <ImageUploaderField initialUrls={values?.imageUrls} />

      <button
        type="submit"
        className="rounded-full bg-[var(--color-primary-ink)] px-5 py-3 font-semibold text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
