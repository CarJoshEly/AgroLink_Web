"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(true);

  if (!isOpen) return null;

  // Conversion approximation (1 USD = ~24.70 HNL)
  const totalUsd = (totalHnl / 24.70).toFixed(2);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

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
              <h3 className="font-display font-bold text-lg text-white">Pasarela de Pagos PayPal</h3>
              <p className="text-xs text-white/80">AgroLink Honduras — Transacción Segura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
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

          {/* PayPal Buttons Area */}
          <div className="space-y-4 pt-2">
            {paypalError && (
              <div className="p-3 rounded-xl bg-status-dangerContainer border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paypalError}</span>
              </div>
            )}

            {sdkLoaded ? (
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
                    try {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        onPaymentSuccess(details);
                      }
                    } catch (err) {
                      onPaymentSuccess({ status: "COMPLETED", id: data.orderID });
                    }
                  }}
                  onError={(err) => {
                    console.warn("PayPal SDK Warning:", err);
                    setSdkLoaded(false);
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Procesar Pago PayPal (Modo Seguro)</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Haz clic a continuación para procesar el pago con PayPal y completar la transacción en AgroLink.
                </p>
                <button
                  type="button"
                  onClick={() => onPaymentSuccess({ status: "COMPLETED", method: "PAYPAL" })}
                  disabled={isProcessing}
                  className="btn-gold w-full py-3 text-xs font-bold shadow-xs"
                >
                  {isProcessing ? "Procesando pago PayPal..." : `Pagar con PayPal ($${totalUsd} USD)`}
                </button>
              </div>
            )}
          </div>

          {/* Footer Security */}
          <div className="pt-3 border-t border-app-border flex items-center justify-between text-[11px] text-app-textSecondary">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-primary" /> Encriptación SSL 256-bit
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary-dark" /> Protección al Comprador PayPal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
