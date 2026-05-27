import type { PaymentRequest, PaymentSession } from "@/lib/payments/types";

export async function createMockPayment(
  input: PaymentRequest,
): Promise<PaymentSession> {
  const autoApprove = (process.env.SANDBOX_PAYMENT_MODE ?? "mock") === "mock";

  return {
    provider: input.paymentMethod.includes("wompi") ? "Wompi" : "Mercado Pago",
    reference: `${input.orderNumber}-${Date.now()}`,
    providerOrderId: crypto.randomUUID(),
    status: autoApprove ? "PAID" : "PENDING",
    redirectUrl: `/checkout?payment=${autoApprove ? "paid" : "pending"}`,
    raw: { sandbox: true, autoApprove },
  };
}
