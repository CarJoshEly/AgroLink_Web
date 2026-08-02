import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  ShieldCheck,
  Truck,
  TrendingUp,
  Store,
  ShoppingBag,
  ArrowRight,
  Wheat,
  Coffee,
  Apple,
  Milk,
  PackageCheck,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";
import { fetchProducts, type Product } from "@/lib/api/products";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    id: "granos",
    name: "Granos Básicos",
    desc: "Maíz, frijol rojo, arroz y sorgo de cosecha fresca.",
    icon: Wheat,
  },
  {
    id: "cafe",
    name: "Café & Cacao",
    desc: "Café de altura de Marcala, Copán y Santa Bárbara.",
    icon: Coffee,
  },
  {
    id: "frutas",
    name: "Frutas & Verduras",
    desc: "Tomate, aguacate, plátano, cítricos y vegetales.",
    icon: Apple,
  },
  {
    id: "lacteos",
    name: "Lácteos & Quesos",
    desc: "Queso seco, cuajada, mantequilla crema y derivados.",
    icon: Milk,
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Vendedores Verificados",
    desc: "Verificamos el perfil e identidad de cada productor para garantizar compras seguras.",
  },
  {
    icon: TrendingUp,
    title: "Precios Justos del Campo",
    desc: "Sin intermediarios innecesarios. Transacciones directas entre finca y comprador.",
  },
  {
    icon: Truck,
    title: "Entrega Directa",
    desc: "Logística coordinada desde el origen agrícola hasta mercados y negocios.",
  },
  {
    icon: PackageCheck,
    title: "Calidad Hondureña",
    desc: "Cosechas frescas seleccionadas de departamentos en todo Honduras.",
  },
];

export default async function HomePage() {
  let products: Product[] = [];
  try {
    const res = await fetchProducts({ limit: 8 });
    products = res.products;
  } catch (e) {
    console.error("Error al cargar productos en landing:", e);
  }

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-12">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary-dark via-[#13160F] to-primary-dark text-[#EDF0E8] py-20 md:py-28 overflow-hidden">
        {/* Background Image with Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-fields.png"
            alt="Campos agrícolas de Honduras"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#13160F] via-primary-dark/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13160F] via-transparent to-[#13160F]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-semibold tracking-wide mb-6">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Plataforma Agrícola Oficial de Honduras</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-white mb-6">
              Del campo hondureño <br />
              <span className="text-secondary">
                directo a tu mesa.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#B2BAA9] text-base sm:text-lg leading-relaxed mb-8 font-normal max-w-xl">
              Conectamos a agricultores, cooperativas y productores locales directamente con comercios, restaurantes y consumidores en toda Honduras.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/productos"
                className="btn-gold text-base py-3 px-7 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                Explorar Catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/registro/vendedor"
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-base py-3 px-7 backdrop-blur-md"
              >
                <Store className="w-5 h-5 text-secondary" />
                Vender Cosecha
              </Link>
            </div>

            {/* Micro Trust items */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#B2BAA9]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Productores Hondureños</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Comercio Directo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Perfil Verificado</span>
              </div>
            </div>
          </div>

          {/* Side Hero Feature Box */}
          <div className="w-full lg:w-96 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-onSecondary flex items-center justify-center font-bold mb-5 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Calidad & Trato Directo
            </h3>
            <p className="text-xs text-[#B2BAA9] leading-relaxed mb-6">
              Sin intermediarios innecesarios. Los compradores acceden a precios frescos del productor y los vendedores reciben un trato justo.
            </p>
            <div className="p-4 rounded-xl bg-[#13160F]/60 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#B2BAA9]">Cobertura Nacional:</span>
              <span className="font-bold text-secondary">18 Departamentos</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 w-full -mt-12 relative z-20">
        <div className="bg-white rounded-2xl border border-app-border p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm divide-y md:divide-y-0 md:divide-x divide-app-border">
          <div className="pt-2 md:pt-0">
            <p className="font-display text-3xl md:text-4xl font-bold text-primary">100%</p>
            <p className="text-xs font-medium text-app-textSecondary mt-1">Productores Hondureños</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="font-display text-3xl md:text-4xl font-bold text-primary">+18</p>
            <p className="text-xs font-medium text-app-textSecondary mt-1">Departamentos Cobertura</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="font-display text-3xl md:text-4xl font-bold text-primary">0%</p>
            <p className="text-xs font-medium text-app-textSecondary mt-1">Comisiones Ocultas</p>
          </div>
          <div className="pt-2 md:pt-0">
            <p className="font-display text-3xl md:text-4xl font-bold text-primary">Directo</p>
            <p className="text-xs font-medium text-app-textSecondary mt-1">Finca a Comprador</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-secondary-dark font-bold mb-1">
              Rubros Principales
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-app-textPrimary font-bold">
              Explorar Categorías
            </h2>
          </div>
          <Link
            href="/productos"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
          >
            Ver catálogo completo
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/productos?category=${cat.id}`}
                className="group bg-white p-6 rounded-2xl border border-app-border shadow-sm card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-status-successContainer border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-status-warningContainer group-hover:text-secondary-dark transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-app-textPrimary group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-app-textSecondary mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-primary group-hover:text-secondary-dark">
                  <span>Ver productos</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-app-surfaceVariant/60 py-16 border-y border-app-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-secondary-dark font-bold mb-1">
                Ofertas del Día
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-app-textPrimary font-bold">
                Productos Destacados del Campo
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
            >
              Ver todas las publicaciones ({products.length})
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-app-border p-10 text-center max-w-md mx-auto">
              <Sprout className="w-12 h-12 text-primary/60 mx-auto mb-3" />
              <p className="text-sm text-app-textSecondary font-medium">No se pudieron cargar productos en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY AGROLINK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-secondary-dark font-bold mb-1">
            Ventajas Clave
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-app-textPrimary font-bold">
            ¿Por qué utilizar AgroLink Honduras?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-app-border shadow-sm flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-status-successContainer border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-base font-bold text-app-textPrimary mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-app-textSecondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FARMER SPOTLIGHT STORY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="bg-gradient-to-br from-primary-dark to-[#13160F] text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              Desarrollo Rural Sostenible
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Apoyando el trabajo de los agricultores hondureños
            </h2>
            <p className="text-sm text-[#B2BAA9] leading-relaxed mb-8">
              AgroLink le permite a pequeños y medianos productores dar a conocer sus cosechas en todo el país sin costos ocultos, asegurando un precio justo y directo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/vendedores"
                className="btn-gold py-2.5 px-5 text-sm"
              >
                Directorio de Vendedores <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/registro/vendedor"
                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 py-2.5 px-5 text-sm"
              >
                Registrarme como Productor
              </Link>
            </div>
          </div>

          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
            <Image
              src="/farmer-portrait.png"
              alt="Productor hondureño"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
