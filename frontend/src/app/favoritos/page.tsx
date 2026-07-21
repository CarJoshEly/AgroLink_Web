export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-2">Favoritos</h1>
      <p className="text-sm text-soil-500 mb-8">Productos y vendedores que has guardado.</p>
      <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
        Aún no tienes favoritos.
      </div>
    </div>
  );
}
