"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchUserById, activateUser, deactivateUser, deleteUser } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { USER_ROLE_LABELS, VERIFICATION_STATUS_LABELS } from "@/lib/labels";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function AdminUsuarioDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin-user", params.id],
    queryFn: () => fetchUserById(params.id),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-user", params.id] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const activate = useMutation({ mutationFn: () => activateUser(params.id), onSuccess: invalidate });
  const deactivate = useMutation({ mutationFn: () => deactivateUser(params.id), onSuccess: invalidate });
  const remove = useMutation({
    mutationFn: () => deleteUser(params.id),
    onSuccess: () => router.push("/admin/usuarios"),
  });

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  const error = activate.error || deactivate.error || remove.error;

  return (
    <div>
      <Link href="/admin/usuarios" className="inline-flex items-center gap-1.5 text-sm text-forest-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a usuarios
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-display text-2xl text-forest-900">{user.name}</h1>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-stamp ${
            user.isActive ? "bg-forest-100 text-forest-700" : "bg-red-50 text-red-700"
          }`}
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>
      <p className="text-sm text-soil-500 mb-6">
        {user.email} · {USER_ROLE_LABELS[user.role]} · {user.phone ?? "sin teléfono"}
      </p>

      {error && (
        <p className="text-sm text-red-600 mb-4">
          {error instanceof ApiError ? error.rawMessage.join(" ") : "No se pudo completar la acción."}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {user.isActive ? (
          <button
            type="button"
            onClick={() => deactivate.mutate()}
            disabled={deactivate.isPending}
            className="text-sm px-3 py-1.5 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
          >
            Desactivar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => activate.mutate()}
            disabled={activate.isPending}
            className="text-sm px-3 py-1.5 rounded-stamp border border-forest-700 bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
          >
            Activar
          </button>
        )}
        <button
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={remove.isPending}
          className="text-sm px-3 py-1.5 rounded-stamp border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Eliminar cuenta
        </button>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar cuenta"
        message={`¿Eliminar la cuenta de "${user.name}"? Esta acción es irreversible desde esta pantalla.`}
        confirmLabel="Eliminar"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      {user.sellerProfile && (
        <div className="border border-forest-100 rounded-stamp p-4 mb-6">
          <p className="text-sm font-medium text-forest-800 mb-2">Perfil de vendedor</p>
          <p className="text-sm text-soil-600">{user.sellerProfile.businessName}</p>
          <p className="text-xs text-soil-400 mt-1">
            Verificación: {VERIFICATION_STATUS_LABELS[user.sellerProfile.verificationStatus]}
          </p>
          <Link
            href={`/admin/vendedores/${user.sellerProfile.id}`}
            className="inline-block text-xs text-forest-600 hover:text-forest-800 mt-2"
          >
            Ver panel de verificación →
          </Link>
        </div>
      )}

      {user.locations && user.locations.length > 0 && (
        <div className="border border-forest-100 rounded-stamp p-4">
          <p className="text-sm font-medium text-forest-800 mb-2">Ubicaciones registradas</p>
          <p className="text-sm text-soil-500">{user.locations.length} ubicación(es) guardada(s).</p>
        </div>
      )}
    </div>
  );
}
