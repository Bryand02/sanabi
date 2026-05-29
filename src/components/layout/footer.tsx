import Image from "next/image";
import { appVersion } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.7)] bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-28 overflow-hidden rounded-[1.1rem] border border-white/80 bg-white shadow-[0_10px_24px_rgba(255,193,139,0.18)]">
              <Image
                src="/brand/sanabi-kids-logo.jpeg"
                alt="Logo de Sanabi Kids"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <p className="font-display text-2xl text-[var(--color-primary-ink)]">Sanabi Kids</p>
          </div>
          <p className="mt-3 max-w-sm">
            Moda infantil nueva y de segunda mano para familias que buscan diseño,
            calidad y una experiencia de compra clara.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Cobertura</p>
          <p className="mt-3">Envíos a todo Colombia con seguimiento del pedido.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Pagos</p>
          <p className="mt-3">
            Estructura lista para integrar PSE con Wompi o Mercado Pago.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-6 text-[11px] tracking-[0.12em] text-slate-400 sm:px-6 lg:px-8">
        Versión {appVersion}
      </div>
    </footer>
  );
}
