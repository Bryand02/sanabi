import { productCategories, productGenders, productSizes } from "@/lib/constants";

type Props = {
  selected: Record<string, string | undefined>;
};

export function CatalogFilters({ selected }: Props) {
  return (
    <form className="grid gap-4 rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(157,181,170,0.14)] md:grid-cols-6">
      <input
        type="text"
        name="search"
        defaultValue={selected.search}
        placeholder="Buscar por nombre"
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      />
      <select
        name="category"
        defaultValue={selected.category}
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">Categoría</option>
        {productCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        name="size"
        defaultValue={selected.size}
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">Talla</option>
        {productSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <select
        name="condition"
        defaultValue={selected.condition}
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">Estado</option>
        <option value="NEW">Nuevo</option>
        <option value="PRELOVED">Segunda mano</option>
      </select>
      <select
        name="gender"
        defaultValue={selected.gender}
        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">Género</option>
        {productGenders.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-2xl bg-[var(--color-primary-ink)] px-4 py-3 font-semibold text-white"
      >
        Filtrar
      </button>
    </form>
  );
}
