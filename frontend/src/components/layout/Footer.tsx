export default function Footer() {
  return (
    <footer className="border-t border-forest-100 mt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-soil-600 flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} AgroLink Honduras. Conectando el ecosistema agrícola.</p>
        <p className="text-soil-400">MVP — Fase de desarrollo (frontend)</p>
      </div>
    </footer>
  );
}
