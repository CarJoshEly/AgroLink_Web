export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-2">Tu carrito</h1>
      <p className="text-sm text-soil-500 mb-8">
        Al enviar, se genera una Solicitud de Compra que el vendedor debe aceptar o rechazar (aún no se procesa pago en el MVP).
      </p>
      <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
        Tu carrito está vacío.
      </div>
    </div>
  );
}
