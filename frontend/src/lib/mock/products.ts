import { Product } from "@/lib/types";

export const mockProducts: Product[] = [
  {
    id: "p1",
    sellerId: "s1",
    seller: { id: "s1", businessName: "Finca El Roble", hasVerifiedBadge: true, reputationAverage: 4.8 },
    name: "Café pergamino Marcala",
    description:
      "Café de altura cultivado en Marcala, La Paz. Cosecha reciente, secado al sol, listo para trilla.",
    category: "Café",
    price: 2200,
    unit: "qq",
    stock: 40,
    status: "ACTIVE",
    images: [
      { id: "i1", url: "/placeholder-product.svg", isCover: true },
    ],
    department: "La Paz",
    createdAt: "2026-07-01",
  },
  {
    id: "p2",
    sellerId: "s2",
    seller: { id: "s2", businessName: "Agropecuaria Los Naranjos", hasVerifiedBadge: false, reputationAverage: 4.2 },
    name: "Frijol rojo seco",
    description: "Frijol rojo de grano seleccionado, cosecha de primera, empacado en quintales.",
    category: "Granos básicos",
    price: 1450,
    unit: "qq",
    stock: 120,
    status: "ACTIVE",
    images: [{ id: "i2", url: "/placeholder-product.svg", isCover: true }],
    department: "Comayagua",
    createdAt: "2026-06-20",
  },
  {
    id: "p3",
    sellerId: "s1",
    seller: { id: "s1", businessName: "Finca El Roble", hasVerifiedBadge: true, reputationAverage: 4.8 },
    name: "Miel de abeja pura",
    description: "Miel 100% natural, extraída y envasada en finca. Sin procesar.",
    category: "Apicultura",
    price: 95,
    unit: "unidad",
    stock: 60,
    status: "ACTIVE",
    images: [{ id: "i3", url: "/placeholder-product.svg", isCover: true }],
    department: "La Paz",
    createdAt: "2026-07-10",
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}
