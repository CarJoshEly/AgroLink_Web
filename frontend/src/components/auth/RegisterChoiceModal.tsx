"use client";

import Link from "next/link";
import { X, ShoppingBag, Store, ArrowRight, Sprout } from "lucide-react";

interface RegisterChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterChoiceModal({ isOpen, onClose }: RegisterChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-app-border overflow-hidden animate-slideDown">
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Registro en AgroLink</h3>
              <p className="text-xs text-white/80">Selecciona tu tipo de cuenta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-app-textSecondary uppercase tracking-wider mb-2">
            ¿Cómo deseas registrarte hoy?
          </p>

          {/* Option 1: Comprador */}
          <Link
            href="/registro/comprador"
            onClick={onClose}
            className="group block p-4 rounded-xl border border-app-border hover:border-primary bg-white hover:bg-status-successContainer/30 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-successContainer text-primary flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-app-textPrimary group-hover:text-primary transition-colors">
                    Registrarme como Comprador
                  </h4>
                  <p className="text-xs text-app-textSecondary mt-0.5 leading-relaxed">
                    Compra productos agrícolas frescos directamente a agricultores hondureños.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-app-textDisabled group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </div>
          </Link>

          {/* Option 2: Vendedor */}
          <Link
            href="/registro/vendedor"
            onClick={onClose}
            className="group block p-4 rounded-xl border border-app-border hover:border-secondary-dark bg-white hover:bg-status-warningContainer/30 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-warningContainer text-secondary-dark flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-app-textPrimary group-hover:text-secondary-dark transition-colors">
                    Registrarme como Vendedor
                  </h4>
                  <p className="text-xs text-app-textSecondary mt-0.5 leading-relaxed">
                    Vende tus cosechas y productos del campo a compradores en todo Honduras.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-app-textDisabled group-hover:text-secondary-dark group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
