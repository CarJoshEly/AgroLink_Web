import RegisterSellerForm from "@/components/forms/RegisterSellerForm";

export default function RegisterSellerPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Crear cuenta de vendedor</h1>
      <p className="text-sm text-soil-500 mb-8">
        Publica productos y llega a compradores en todo el país.
      </p>

      <RegisterSellerForm />
    </div>
  );
}
