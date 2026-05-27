import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanabi | Tienda online de ropa infantil",
  description:
    "Sanabi es una tienda online de ropa infantil nueva y de segunda mano con pagos, envíos y panel administrativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-shell)] text-slate-900">
        <AuthProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,233,218,0.9),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(217,238,234,0.9),_transparent_28%),linear-gradient(180deg,_#fffaf7_0%,_#f9fbff_50%,_#fffef8_100%)]" />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
