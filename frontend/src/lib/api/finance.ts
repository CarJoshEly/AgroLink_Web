import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { CommissionConfig, PaymentProvider, Transaction, TransactionStatus, PaymentMethod } from "@/lib/types";

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

// --------------------------------------------------------------------------
// Admin — métodos de pago
// --------------------------------------------------------------------------

/** GET /finance/payment-methods/all — incluye inactivos (admin). */
export async function fetchAllPaymentMethods(): Promise<PaymentMethod[]> {
  return apiFetch<PaymentMethod[]>("/finance/payment-methods/all");
}

export interface CreatePaymentMethodInput {
  name: string;
  provider: PaymentProvider;
  isActive?: boolean;
  config?: Record<string, unknown>;
}

export type UpdatePaymentMethodInput = Partial<CreatePaymentMethodInput>;

/** POST /finance/payment-methods — admin. */
export async function createPaymentMethod(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
  return apiFetch<PaymentMethod>("/finance/payment-methods", { method: "POST", body: JSON.stringify(input) });
}

/** PATCH /finance/payment-methods/:id — admin. */
export async function updatePaymentMethod(
  id: string,
  input: UpdatePaymentMethodInput
): Promise<PaymentMethod> {
  return apiFetch<PaymentMethod>(`/finance/payment-methods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

// --------------------------------------------------------------------------
// Admin — configuración de comisiones
// --------------------------------------------------------------------------

/** GET /finance/commission-config/current — público, comisión vigente. */
export async function fetchCurrentCommission(): Promise<CommissionConfig> {
  return apiFetch<CommissionConfig>("/finance/commission-config/current");
}

/** GET /finance/commission-config — historial completo (admin). */
export async function fetchCommissionHistory(
  page = 1,
  limit = 10
): Promise<{ history: CommissionConfig[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<CommissionConfig[]>(
    `/finance/commission-config?page=${page}&limit=${limit}`
  );
  return { history: data, meta };
}

/** POST /finance/commission-config — crea una nueva vigencia (admin). */
export async function createCommissionConfig(percentage: number): Promise<CommissionConfig> {
  return apiFetch<CommissionConfig>("/finance/commission-config", {
    method: "POST",
    body: JSON.stringify({ percentage }),
  });
}

// --------------------------------------------------------------------------
// Admin — transacciones y dashboard financiero
// --------------------------------------------------------------------------

export interface AdminFinanceDashboard {
  totalVolume: number;
  totalCommissionCollected: number;
  currentCommissionPercentage: number | null;
  byStatus: { status: TransactionStatus; count: number; amount: number; commissionAmount: number }[];
  recentTransactions: Transaction[];
}

/** GET /finance/dashboard — dashboard financiero de toda la plataforma (admin). */
export async function fetchAdminFinanceDashboard(): Promise<AdminFinanceDashboard> {
  return apiFetch<AdminFinanceDashboard>("/finance/dashboard");
}

export interface AdminTransactionFilters extends TransactionFilters {}

/** GET /finance/transactions — todas las transacciones de la plataforma (admin). */
export async function fetchAllTransactions(
  filters: AdminTransactionFilters = {}
): Promise<{ transactions: Transaction[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Transaction[]>(`/finance/transactions?${buildQuery(filters)}`);
  return { transactions: data, meta };
}

/** GET /finance/transactions/:id */
export async function fetchTransactionById(id: string): Promise<Transaction> {
  return apiFetch<Transaction>(`/finance/transactions/${id}`);
}

/** PATCH /finance/transactions/:id/status — admin. */
export async function updateTransactionStatus(
  id: string,
  status: Extract<TransactionStatus, "COMPLETED" | "FAILED" | "REFUNDED">,
  externalReference?: string
): Promise<Transaction> {
  return apiFetch<Transaction>(`/finance/transactions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, externalReference }),
  });
}
