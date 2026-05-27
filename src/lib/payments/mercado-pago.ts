import type { PaymentRequest, PaymentSession } from "@/lib/payments/types";
import { createMockPayment } from "@/lib/payments/mock";

export async function createMercadoPagoPayment(
  input: PaymentRequest,
): Promise<PaymentSession> {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return createMockPayment(input);
  }

  return createMockPayment(input);
}
