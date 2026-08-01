"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Input de contraseña con botón de mostrar/ocultar. `forwardRef` es
 * necesario para que funcione con `register()` de react-hook-form (que pasa
 * su propio `ref`) tanto como con inputs controlados por `useState` normal.
 */
const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={`${className ?? "input"} pr-10`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-soil-400 hover:text-forest-700 transition-colors"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  }
);

export default PasswordInput;
