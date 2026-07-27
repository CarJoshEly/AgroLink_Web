import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Transaction, TransactionStatus, PaymentMethod } from "@/lib/types";

export interface FinanceDashboard {
  totalEarnings: number;
  totalVolume: number;
  totalCommissionPaid: number;
  byStatus: { status: TransactionStatus; count: number; amount: number; commissionAmount: number }[];
  recentTransactions: Transaction[];
}

/** GET /finance/dashboard/mine — requiere sesión SELLER. */
export async function fetchSellerFinanceDashboard(): Promise<FinanceDashboard> {
  return apiFetch<FinanceDashboard>("/finance/dashboard/mine");
}

export interface TransactionFilters {
  status?: TransactionStatus;
  paymentMethodId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.paymentMethodId) params.set("paymentMethodId", filters.paymentMethodId);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return params.toString();
}

/** GET /finance/transactions/mine — requiere sesión SELLER. */
export async function fetchMyTransactions(
  filters: TransactionFilters = {}
): Promise<{ transactions: Transaction[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Transaction[]>(`/finance/transactions/mine?${buildQuery(filters)}`);
  return { transactions: data, meta };
}

/** GET /finance/payment-methods — público, solo lectura (para mostrar nombre/proveedor). */
export async function fetchActivePaymentMethods(): Promise<PaymentMethod[]> {
  return apiFetch<PaymentMethod[]>("/finance/payment-methods");
}
