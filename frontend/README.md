# AgroLink — Frontend (Next.js)

Aplicación web del marketplace agrícola AgroLink Honduras, basada en el
documento **"Fase 1 — Análisis y Diseño"**.

## Arranque

Este frontend consume la API REST (NestJS + Prisma), que vive en su propio
repositorio y corre por defecto en `http://localhost:3000`. Este frontend
corre en el puerto **3001** (`npm run dev` ya usa `next dev -p 3001`) para no
chocar con ella — la API ya tiene `http://localhost:3001` autorizado en
`CORS_ORIGINS`.

```bash
# 1. Levanta la API en otra terminal (repo de la API), en el puerto 3000.

# 2. En este repo:
npm install
cp .env.example .env.local   # define NEXT_PUBLIC_API_URL, ver abajo
npm run dev
```

La app corre en `http://localhost:3001`.

### Variables de entorno

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Debe incluir el prefijo completo de la API (`/api/v1`), no solo el host.

## Estructura

```
src/
  app/                    Rutas (App Router)
    layout.tsx             Envuelve la app con Providers (React Query + Auth)
    providers.tsx           QueryClientProvider + AuthProvider
    page.tsx               Catálogo / home (datos mock, ver nota abajo)
    productos/[id]/        Detalle de producto (pestañas Detalle / Reseñas, mock)
    registro/comprador/    Registro sencillo (conectado a la API real)
    registro/vendedor/     Registro avanzado (verificación opcional, mock — ver nota abajo)
    carrito/, favoritos/, perfil/
    dev-health/             Pantalla temporal de verificación de conexión a la API
  components/
    layout/                 Navbar, Footer
    product/                 ProductCard, ProductGallery, ImageUploader,
                              ReviewsTab, ReviewCard, ReviewForm
    forms/                   RegisterBuyerForm, RegisterSellerForm
    ui/                      VerificationBadge, StarRating, Tabs
  hooks/
    useAuth.ts               Hook para consumir AuthContext
  lib/
    api/
      client.ts               Cliente HTTP real: envelope, ApiError, refresh automático en 401
      queryClient.ts           Configuración de @tanstack/react-query
      auth.ts                  login/refresh/logout/me/registerBuyer (reales) + registerSeller (mock)
      products.ts, reviews.ts  Catálogo — hoy mock, tipos aislados de lib/types (ver nota abajo)
    auth/
      AuthContext.tsx          AuthProvider: user, accessToken, isLoading, login(), logout(), refreshSession()
      authStore.ts              Estado de sesión compartido entre AuthContext y client.ts
    mock/                    Datos de ejemplo del catálogo
    types/                   Tipos calcados 1:1 de schema.prisma (API real)
    labels.ts                Diccionarios español de cada enum de lib/types
```

### Nota — catálogo mock aún no conectado

`lib/types/index.ts` es fiel al `schema.prisma` real de la API. El catálogo
de productos/reseñas (`lib/mock/`, `ProductCard`, `ProductGallery`,
`ImageUploader`, `ReviewCard`/`ReviewsTab`/`ReviewForm`, la página de
detalle de producto) todavía sirve datos simulados con una forma de datos
distinta (más simple) y tipos propios definidos junto al mock
(`lib/mock/products.ts`, `lib/mock/reviews.ts`, re-exportados por
`lib/api/products.ts`/`lib/api/reviews.ts`). Se reconecta a la API real, con
la forma de datos real, en el sprint que reconstruya esas pantallas.

Igual pasa con `RegisterSellerForm`: el formulario actual no recolecta
`dni`/`departmentId`/`municipalityId`/`address`/`latitude`/`longitude` (todos
obligatorios en el DTO real del backend), así que `registerSeller()` sigue
en mock hasta que ese formulario se reconstruya.

## Sesión y tokens

- **`accessToken`**: vive en memoria (estado de `AuthContext`, React). Se
  pierde al recargar la página y se regenera automáticamente al montar la
  app si hay un `refreshToken` válido guardado.
- **`refreshToken`**: vive en una cookie **no-httpOnly** (vía `js-cookie`).

**Trade-off de seguridad aceptado explícitamente**: este frontend no tiene
un backend propio (no hay Next API routes actuando de BFF) que pueda setear
cookies httpOnly — el único backend es la API NestJS externa, que no puede
controlar cookies del dominio del frontend. Guardar el refresh token en una
cookie legible por JavaScript lo hace vulnerable a robo vía XSS. Se acepta
para el alcance académico de este proyecto; en un entorno de producción real
esto se resolvería con un backend intermedio (BFF) que sí pueda usar cookies
httpOnly.

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
