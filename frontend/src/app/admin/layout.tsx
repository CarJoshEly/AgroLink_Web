import RouteGuard from "@/components/auth/RouteGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </RouteGuard>
  );
}
