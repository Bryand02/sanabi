export const orderStatusLabels = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
} as const;

export const appVersion = "1.2";

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

export const colombiaLocationsByState = {
  Antioquia: ["Medellín", "Envigado", "Itagüí", "Bello", "Rionegro"],
  Atlántico: ["Barranquilla", "Soledad", "Puerto Colombia"],
  "Bogotá D.C.": ["Bogotá"],
  Bolívar: ["Cartagena", "Turbaco", "Magangué"],
  Boyacá: ["Tunja", "Duitama", "Sogamoso"],
  Caldas: ["Manizales", "Villamaría", "La Dorada"],
  Cauca: ["Popayán", "Santander de Quilichao"],
  Cesar: ["Valledupar", "Aguachica"],
  Cundinamarca: ["Soacha", "Chía", "Zipaquirá", "Facatativá", "Mosquera"],
  Huila: ["Neiva", "Pitalito"],
  Magdalena: ["Santa Marta", "Ciénaga"],
  Meta: ["Villavicencio", "Acacías"],
  Nariño: ["Pasto", "Ipiales"],
  "Norte de Santander": ["Cúcuta", "Ocaña"],
  Quindío: ["Armenia", "Calarcá"],
  Risaralda: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  Santander: ["Bucaramanga", "Floridablanca", "Girón"],
  Tolima: ["Ibagué", "Espinal"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
} as const;

export const colombiaDepartments = Object.keys(colombiaLocationsByState);

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
