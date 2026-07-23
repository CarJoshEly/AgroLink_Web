// Tipos locales del catálogo mock — deliberadamente aislados de
// `@/lib/types` (que ahora es fiel al schema.prisma real). Este catálogo
// se reconecta a la API real, con su forma de datos real, en el sprint que
// lo reconstruya.

export interface MockProductImage {
  id: string;
  url: string;
  isCover: boolean;
}

export interface MockProductSeller {
  id: string;
  businessName: string;
  hasVerifiedBadge: boolean;
  reputationAverage?: number;
}

export interface MockProduct {
  id: string;
  sellerId: string;
  seller?: MockProductSeller;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: "qq" | "lb" | "kg" | "unidad" | "caja";
  stock: number;
  status: "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";
  images: MockProductImage[];
  department?: string;
  createdAt: string;
}

export const mockProducts: MockProduct[] = [
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

export function getProductById(id: string): MockProduct | undefined {
  return mockProducts.find((p) => p.id === id);
}
