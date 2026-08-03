"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { X, ShieldCheck, CreditCard, Lock, AlertCircle } from "lucide-react";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/lib/types";

interface PayPalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalHnl: number;
  onPaymentSuccess: (orders: Order[]) => void;
  isProcessing: boolean;
}

/**
 * El monto mostrado (`totalHnl`/`totalUsd`) es solo para que el comprador
 * vea cuánto va a pagar — el monto que de verdad se cobra lo recalcula el
 * backend a partir del carrito (`POST /payments/paypal/orders`) y es lo
 * único que PayPal termina usando. `createOrder`/`onApprove` llaman al
 * backend (no `actions.order.create/capture` del lado del cliente) para que
 * la captura quede verificada server-to-server antes de generar el pedido.
 */
export default function PayPalPaymentModal({
  isOpen,
  onClose,
  totalHnl,
  onPaymentSuccess,
  isProcessing,
}: PayPalPaymentModalProps) {
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  if (!isOpen) return null;

  const totalUsd = (totalHnl / 24.70).toFixed(2);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";
  const busy = isProcessing || isCapturing;

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
                disabled={busy}
                createOrder={async () => {
                  setPaypalError(null);
                  try {
                    const order = await createPaypalOrder();
                    return order.paypalOrderId;
                  } catch (err) {
                    setPaypalError(
                      err instanceof ApiError ? err.message : "No se pudo iniciar el pago con PayPal"
                    );
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  setIsCapturing(true);
                  setPaypalError(null);
                  try {
                    const orders = await capturePaypalOrder(data.orderID);
                    onPaymentSuccess(orders);
                  } catch (err) {
                    setPaypalError(
                      err instanceof ApiError ? err.message : "No se pudo confirmar el pago con PayPal"
                    );
                  } finally {
                    setIsCapturing(false);
                  }
                }}
                onError={(err) => {
                  console.warn("PayPal SDK Warning:", err);
                  setPaypalError("PayPal no está disponible en este momento. Intenta de nuevo más tarde.");
                }}
              />
            </PayPalScriptProvider>
            {isCapturing && (
              <p className="text-xs text-app-textSecondary text-center">Confirmando tu pago con PayPal…</p>
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
