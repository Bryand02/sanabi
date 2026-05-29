export const orderStatusLabels = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
} as const;

export const appVersion = "1.6";

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
  "Bebe",
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

export const productGenders = ["Nina", "Nino", "Unisex"];

export const colombiaLocationsByState = {
  Antioquia: ["Medellin", "Envigado", "Itagui", "Bello", "Rionegro"],
  Atlantico: ["Barranquilla", "Soledad", "Puerto Colombia"],
  "Bogota D.C.": ["Bogota"],
  Bolivar: ["Cartagena", "Turbaco", "Magangue"],
  Boyaca: ["Tunja", "Duitama", "Sogamoso"],
  Caldas: ["Manizales", "Villamaria", "La Dorada"],
  Cauca: ["Popayan", "Santander de Quilichao"],
  Cesar: ["Valledupar", "Aguachica"],
  Cundinamarca: ["Soacha", "Chia", "Zipaquira", "Facatativa", "Mosquera"],
  Huila: ["Neiva", "Pitalito"],
  Magdalena: ["Santa Marta", "Cienaga"],
  Meta: ["Villavicencio", "Acacias"],
  Narino: ["Pasto", "Ipiales"],
  "Norte de Santander": ["Cucuta", "Ocana"],
  Quindio: ["Armenia", "Calarca"],
  Risaralda: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  Santander: ["Bucaramanga", "Floridablanca", "Giron"],
  Sucre: ["Sincelejo", "Corozal", "Sampues"],
  Tolima: ["Ibague", "Espinal"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
} as const;

export const colombiaDepartments = Object.keys(colombiaLocationsByState);

export const paymentOptions = [
  {
    value: "wompi_pse",
    label: "PSE con Wompi",
    description: "Base lista para integrar Wompi en produccion.",
  },
  {
    value: "mercado_pago_pse",
    label: "PSE con Mercado Pago",
    description: "Alternativa preparada para checkout nacional.",
  },
];
