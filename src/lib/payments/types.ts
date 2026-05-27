export type PaymentSession = {
  provider: string;
  reference: string;
  providerOrderId?: string;
  status: "PENDING" | "PAID";
  redirectUrl?: string;
  raw?: Record<string, unknown>;
};

export type PaymentRequest = {
  orderNumber: string;
  amount: number;
  customerEmail: string;
  paymentMethod: "wompi_pse" | "mercado_pago_pse";
};
