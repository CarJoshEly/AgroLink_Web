# AgroLink — Frontend (Next.js)

Aplicación web del marketplace agrícola AgroLink Honduras, basada en el
documento **"Fase 1 — Análisis y Diseño"**.

## Arranque

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app corre en `http://localhost:3000` y funciona de inmediato con datos
mock (`src/lib/mock/`) — no necesita backend para probarse.

## Estructura

```
src/
  app/                    Rutas (App Router)
    page.tsx              Catálogo / home
    productos/[id]/       Detalle de producto (pestañas Detalle / Reseñas)
    registro/comprador/   Registro sencillo
    registro/vendedor/    Registro avanzado (verificación opcional)
    carrito/, favoritos/, perfil/
  components/
    layout/                Navbar, Footer
    product/                ProductCard, ProductGallery, ImageUploader,
                             ReviewsTab, ReviewCard, ReviewForm
    forms/                  RegisterBuyerForm, RegisterSellerForm
    ui/                     VerificationBadge, StarRating, Tabs
  lib/
    api/                    client.ts + products.ts / reviews.ts / auth.ts
                             (hoy devuelven mock; ya preparados para la API real)
    mock/                   Datos de ejemplo
    types/                  Tipos compartidos (Product, Review, User, etc.)
```

## Conectar la API externa / backend más adelante

1. Define `NEXT_PUBLIC_API_URL` en `.env.local`.
2. En cada archivo de `src/lib/api/` (products.ts, reviews.ts, auth.ts) hay
   bloques `--- MOCK ---` y `--- API REAL ---` ya escritos; solo hay que
   activar el segundo y borrar el primero.
3. Los componentes de UI nunca llaman `fetch` directamente — siempre pasan
   por `lib/api/`, así que no hay que tocarlos.

## Funcionalidades ya incluidas según lo solicitado

- **Imagen de producto**: `ImageUploader` permite agregar, marcar portada y
  eliminar imágenes al publicar/editar un producto.
- **Pestaña de reseñas**: en el detalle de producto, junto a "Detalle".
  Incluye formulario para dejar reseña y listado moderado.
- **Registro sin datos obligatorios de identidad**: ni el número de
  identidad, ni las fotos de DNI, ni la prueba de vida son requeridos en
  ningún formulario de registro. Quien los complete (opcionalmente) y sea
  aprobado por un administrador obtiene la insignia **Verificado**
  (`VerificationBadge`), visible en su perfil y en sus productos.
