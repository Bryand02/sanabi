export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.7)] bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl text-[var(--color-primary-ink)]">Sanabi</p>
          <p className="mt-3 max-w-sm">
            Tienda online de ropa infantil nueva y de segunda mano, pensada para
            familias que buscan estilo, cuidado y confianza.
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
    </footer>
  );
}
