# AgroLink Honduras

Marketplace agrícola hondureño. Este repo sigue la estructura prevista en el
documento **"Fase 1 — Análisis y Diseño"**: frontend Web en Next.js
consumiendo una única API REST (NestJS), que hoy todavía no existe.

```
agrolink/
  frontend/   Aplicación web (lista para correr, con datos mock)
  backend/    Vacío — se llena en la Fase 3 (NestJS + Prisma + PostgreSQL)
```

## Cómo está pensado el flujo de trabajo

1. **Hoy**: trabajas y pruebas todo en `frontend/`, con datos simulados.
2. **Cuando tengas la API** (propia o externa): defines `NEXT_PUBLIC_API_URL`
   en `frontend/.env.local` y activas las llamadas reales ya dejadas listas
   (comentadas) en `frontend/src/lib/api/`.
3. **Backend**: cuando empieces la Fase 3, todo va dentro de `backend/`
   (ver `backend/README.md` para el detalle de lo que debe contener según
   el documento de análisis).

Ver `frontend/README.md` para instrucciones de arranque y detalle de las
funcionalidades ya implementadas (imagen de producto, pestaña de reseñas,
registro con verificación de identidad opcional + insignia).
