import RouteGuard from "@/components/auth/RouteGuard";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <AdminNav />
        {children}
      </div>
    </RouteGuard>
  );
}
