import type { PaymentRequest, PaymentSession } from "@/lib/payments/types";
import { createMockPayment } from "@/lib/payments/mock";

export async function createWompiPayment(
  input: PaymentRequest,
): Promise<PaymentSession> {
  if (!process.env.WOMPI_PUBLIC_KEY || !process.env.WOMPI_PRIVATE_KEY) {
    return createMockPayment(input);
  }

  return createMockPayment(input);
}
