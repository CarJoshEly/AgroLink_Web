import { fetchProducts } from "./products";
import type { Product, PublicSeller } from "@/lib/types";

/**
 * La API todavía no expone un GET /sellers/:id público (GET /users/:id existe
 * pero es solo para ADMIN). Como workaround, derivamos los datos públicos del
 * vendedor a partir de uno de sus productos, que sí incluye
 * `seller: {id, businessName, verificationStatus}` embebido.
 *
 * Limitación: si el vendedor no tiene productos publicados, `seller` será
 * `null` y no hay forma de mostrar su nombre. Para resolverlo de raíz hace
 * falta agregar un endpoint público dedicado en el backend.
 */
export async function fetchSellerProfile(
  sellerId: string
): Promise<{ seller: PublicSeller | null; products: Product[] }> {
  const { products } = await fetchProducts({ sellerId, limit: 50 });
  const seller = products[0]?.seller ?? null;
  return { seller, products };
}
