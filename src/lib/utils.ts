export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function getShippingCost(
  subtotal: number,
  shippingState?: string | null,
  shippingCity?: string | null,
) {
  if (subtotal >= 150000 || subtotal === 0) {
    return 0;
  }

  if (shippingState === "Sucre" && shippingCity === "Sincelejo") {
    return 6000;
  }

  return 12000;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
