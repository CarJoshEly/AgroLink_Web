import { Suspense } from "react";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-6">Ingresar</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
