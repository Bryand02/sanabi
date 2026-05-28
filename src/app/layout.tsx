import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanabi Kids | Tienda online de moda infantil",
  description:
    "Sanabi Kids es una tienda online de moda infantil nueva y de segunda mano con pagos, envíos y panel administrativo.",
  manifest: "/manifest.webmanifest",
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
      <body className="brand-grid min-h-full bg-[var(--color-shell)] text-slate-900">
        <AuthProvider>
          <CartProvider>
            <PwaRegistrar />
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -z-10 brand-dots opacity-50" />
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
