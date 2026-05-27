import { createMercadoPagoPayment } from "@/lib/payments/mercado-pago";
import { createWompiPayment } from "@/lib/payments/wompi";
import type { PaymentRequest } from "@/lib/payments/types";

export async function createPaymentSession(input: PaymentRequest) {
  if (input.paymentMethod === "wompi_pse") {
    return createWompiPayment(input);
  }

  return createMercadoPagoPayment(input);
}
