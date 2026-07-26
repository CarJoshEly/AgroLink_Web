import IdentityVerificationForm from "@/components/forms/IdentityVerificationForm";

export default function SellerVerificationPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Verificación de identidad</h1>
      <p className="text-sm text-soil-500 mb-8">
        Sube tu DNI (frontal y posterior), una selfie y una prueba de vida para que un administrador
        valide tu identidad.
      </p>
      <IdentityVerificationForm />
    </div>
  );
}
