"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2 } from "lucide-react";

interface PayPalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalHnl: number;
  onPaymentSuccess: (details: any) => void;
  isProcessing: boolean;
}

export default function PayPalPaymentModal({
  isOpen,
  onClose,
  totalHnl,
  onPaymentSuccess,
  isProcessing,
}: PayPalPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "direct">("paypal");
  const [paypalError, setPaypalError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Approximate conversion to USD for PayPal processing (1 USD = ~24.70 HNL)
  const totalUsd = (totalHnl / 24.70).toFixed(2);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-app-border overflow-hidden animate-slideDown">
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Pasarela de Pagos</h3>
              <p className="text-xs text-white/80">AgroLink Honduras — Pago Seguro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Order Total summary */}
          <div className="bg-app-surfaceVariant p-4 rounded-xl border border-app-border flex items-center justify-between">
            <div>
              <p className="text-xs text-app-textSecondary">Monto Total del Pedido</p>
              <p className="font-display text-2xl font-bold text-app-textPrimary">
                L. {totalHnl.toLocaleString("es-HN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-app-textSecondary uppercase tracking-wider font-semibold">Equivalente USD</p>
              <p className="text-sm font-bold text-primary">${totalUsd} USD</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-app-textSecondary mb-3 block">
              Selecciona Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-status-successContainer/40 ring-2 ring-primary/20 shadow-xs"
                    : "border-app-border bg-white hover:bg-app-surfaceVariant"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary-dark font-bold text-xs">
                  PP
                </div>
                <div>
                  <p className="text-xs font-bold text-app-textPrimary">PayPal / Tarjeta</p>
                  <p className="text-[10px] text-app-textSecondary">Procesamiento instantáneo</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("direct")}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === "direct"
                    ? "border-primary bg-status-successContainer/40 ring-2 ring-primary/20 shadow-xs"
                    : "border-app-border bg-white hover:bg-app-surfaceVariant"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  HN
                </div>
                <div>
                  <p className="text-xs font-bold text-app-textPrimary">Solicitud / Acuerdo</p>
                  <p className="text-[10px] text-app-textSecondary">Pago directo al vendedor</p>
                </div>
              </button>
            </div>
          </div>

          {/* PayPal Integration Container */}
          {paymentMethod === "paypal" ? (
            <div className="space-y-4 pt-2">
              {paypalError && (
                <div className="p-3 rounded-xl bg-status-dangerContainer border border-status-danger/30 text-status-danger text-xs">
                  {paypalError}
                </div>
              )}

              <PayPalScriptProvider
                options={{
                  clientId: clientId,
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "pay",
                  }}
                  disabled={isProcessing}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: totalUsd,
                          },
                          description: `Pedido AgroLink Honduras - L. ${totalHnl}`,
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      onPaymentSuccess(details);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    setPaypalError("Ocurrió un error al procesar el pago con PayPal. Intenta de nuevo.");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="pt-2 space-y-4">
              <div className="p-4 rounded-xl bg-app-surfaceVariant border border-app-border text-xs text-app-textSecondary leading-relaxed">
                <p className="font-semibold text-app-textPrimary mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Orden por Solicitud Directa
                </p>
                Se enviará la solicitud de compra directamente a cada vendedor en Honduras para acordar la entrega y el pago en efectivo o transferencia local.
              </div>

              <button
                type="button"
                onClick={() => onPaymentSuccess({ method: "DIRECT_ACCOMODATION" })}
                disabled={isProcessing}
                className="btn-primary w-full py-3 text-sm font-semibold"
              >
                {isProcessing ? "Confirmando pedido..." : "Confirmar Pedido Directo"}
              </button>
            </div>
          )}

          {/* Footer Security Seals */}
          <div className="pt-3 border-t border-app-border flex items-center justify-between text-[11px] text-app-textSecondary">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-primary" /> Encriptación SSL 256-bit
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary-dark" /> Protección al Comprador
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
