import { Product } from "@/lib/types";
import { mockProducts, getProductById as getMockProductById } from "@/lib/mock/products";
// import { apiFetch } from "./client";

export async function fetchProducts(): Promise<Product[]> {
  // --- MOCK (activo hoy) ---
  return Promise.resolve(mockProducts);

  // --- API REAL (cuando el backend/API externa exista) ---
  // return apiFetch<Product[]>("/api/products");
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  // --- MOCK (activo hoy) ---
  return Promise.resolve(getMockProductById(id));

  // --- API REAL ---
  // return apiFetch<Product>(`/api/products/${id}`);
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<{ url: string }> {
  // --- MOCK (activo hoy): genera una URL local para previsualizar ---
  const url = URL.createObjectURL(file);
  return Promise.resolve({ url });

  // --- API REAL (Supabase Storage vía backend) ---
  // const formData = new FormData();
  // formData.append("file", file);
  // return apiFetch<{ url: string }>(`/api/products/${productId}/images`, {
  //   method: "POST",
  //   body: formData,
  //   headers: {}, // dejar que el navegador setee el boundary de multipart
  // });
}
