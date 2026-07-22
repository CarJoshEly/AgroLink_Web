import type { MockProduct, MockProductImage } from "@/lib/mock/products";
import { mockProducts, getProductById as getMockProductById } from "@/lib/mock/products";
// import { apiFetch } from "./client";

// El catálogo mock vive aislado de `@/lib/types` (que es fiel al schema.prisma
// real) hasta que este módulo se reconecte a la API real. Se re-exportan los
// tipos del mock bajo estos nombres para que los componentes de catálogo
// puedan seguir importando "Product"/"ProductImage" desde aquí.
export type Product = MockProduct;
export type ProductImage = MockProductImage;

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
