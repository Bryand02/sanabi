export const orderStatusLabels = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
} as const;

export const appVersion = "1.1";

export const conditionLabels = {
  NEW: "Nuevo",
  PRELOVED: "Segunda mano",
} as const;

export const paymentStatusLabels = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
} as const;

export const productCategories = [
  "Vestidos",
  "Conjuntos",
  "Chaquetas",
  "Pijamas",
  "Overoles",
  "Bebé",
  "Camisetas",
  "Pantalones",
  "Zapatos",
];

export const productSizes = [
  "0-3M",
  "3-6M",
  "6-9M",
  "12M",
  "18M",
  "2",
  "3",
  "4",
  "6",
  "8",
  "10",
];

export const productGenders = ["Niña", "Niño", "Unisex"];

export const colombiaLocations = [
  { state: "Antioquia", city: "Medellín" },
  { state: "Atlántico", city: "Barranquilla" },
  { state: "Bogotá D.C.", city: "Bogotá" },
  { state: "Bolívar", city: "Cartagena" },
  { state: "Boyacá", city: "Tunja" },
  { state: "Caldas", city: "Manizales" },
  { state: "Cauca", city: "Popayán" },
  { state: "Cesar", city: "Valledupar" },
  { state: "Cundinamarca", city: "Soacha" },
  { state: "Huila", city: "Neiva" },
  { state: "Magdalena", city: "Santa Marta" },
  { state: "Meta", city: "Villavicencio" },
  { state: "Nariño", city: "Pasto" },
  { state: "Norte de Santander", city: "Cúcuta" },
  { state: "Quindío", city: "Armenia" },
  { state: "Risaralda", city: "Pereira" },
  { state: "Santander", city: "Bucaramanga" },
  { state: "Tolima", city: "Ibagué" },
  { state: "Valle del Cauca", city: "Cali" },
];

export const paymentOptions = [
  {
    value: "wompi_pse",
    label: "PSE con Wompi",
    description: "Base lista para integrar Wompi en producción.",
  },
  {
    value: "mercado_pago_pse",
    label: "PSE con Mercado Pago",
    description: "Alternativa preparada para checkout nacional.",
  },
];
