import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/utils";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Params = {
  to: string;
  name: string;
  orderNumber: string;
  total: number;
  items: Item[];
};

export async function sendOrderConfirmationEmail(params: Params) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM ?? "Sanabi Kids <no-reply@sanabi.local>";

  if (!host || !port || !user || !pass) {
    console.log("Email de confirmacion omitido. Falta configuracion SMTP.", params);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: params.to,
    subject: `Confirmacion de compra ${params.orderNumber} - Sanabi Kids`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2e3b35;">
        <h2>Gracias por tu compra, ${params.name}</h2>
        <p>Tu pedido <strong>${params.orderNumber}</strong> fue recibido correctamente.</p>
        <ul>
          ${params.items
            .map(
              (item) =>
                `<li>${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}</li>`,
            )
            .join("")}
        </ul>
        <p>Total pagado: <strong>${formatPrice(params.total)}</strong></p>
        <p>Te enviaremos novedades del despacho muy pronto.</p>
      </div>
    `,
  });
}
