# AgroLink — Backend (pendiente)

Esta carpeta está intencionalmente vacía. Según el documento **"Fase 1 —
Análisis y Diseño"**, el backend se construye en:

- **NestJS** — API REST única, consumida tanto por Web (Next.js) como por
  Móvil (Flutter). Ningún cliente accede directamente a la base de datos.
- **Prisma ORM** — única vía de acceso a PostgreSQL (sin SQL manual).
- **Supabase Storage** — almacenamiento de archivos (fotos de producto, DNI,
  selfies), desacoplado del contenido relacional.
- **JWT + Refresh Tokens**, bcrypt, control de acceso por rol, rate limiting
  y CORS.

## Cuando se implemente (Fase 3)

1. Los endpoints deben vivir bajo el prefijo `/api/...`.
2. El frontend ya está preparado para consumirlos: solo hay que definir
   `NEXT_PUBLIC_API_URL` en `frontend/.env.local` y reemplazar las funciones
   mock en `frontend/src/lib/api/*.ts` por las llamadas reales (ya están
   comentadas ahí mismo, listas para descomentar).
3. Los tipos en `frontend/src/lib/types/index.ts` deben mantenerse en
   sincronía con el `schema.prisma`.

## Recordatorios clave del documento de análisis

- El registro de comprador es simple (nombre, correo, teléfono, contraseña).
- El registro de vendedor puede incluir número de identidad, fotos de DNI y
  prueba de vida, pero **ninguno de esos campos es obligatorio** para
  ningún tipo de usuario. Completarlos es opcional y, si son aprobados por
  un administrador, otorgan una insignia de verificación (`hasVerifiedBadge`).
- Reviews solo las puede dejar un comprador que completó una compra
  (pedido en estado `DELIVERED`), y quedan en `PENDING_REVIEW` hasta ser
  moderadas.
- Pasarela de pago prevista: PayPal (modelo de datos preparado, sin cobro
  real en el MVP).
