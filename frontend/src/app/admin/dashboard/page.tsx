import RouteGuard from "@/components/auth/RouteGuard";

export default function AdminDashboardPage() {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="font-display text-2xl text-forest-900">Panel de administración</h1>
        <p className="text-sm text-soil-500 mt-2">
          Aquí irá la moderación, verificación de vendedores y reportes (próximo sprint).
        </p>
      </div>
    </RouteGuard>
  );
}
