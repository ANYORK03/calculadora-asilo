# Calculadora de Asilo

Herramienta web para preparadoras migratorias que calcula automáticamente las fechas críticas de un caso de asilo en Estados Unidos.

## Qué calcula

- **Annual Asylum Fee (AAF)** — vencimiento y monto del pago anual obligatorio
- **Asylum Clock** — días válidos acumulados para elegibilidad del permiso de trabajo
- **Permiso de trabajo I-765 (c)(8)** — elegibilidad para presentar y recibir el EAD
- **One-Year Bar** — estado del plazo de un año para presentar el I-589
- **Fechas críticas** — lista priorizada de próximos eventos del caso

## Stack

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript (strict)
- **UI:** Tailwind CSS + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **PDF:** @react-pdf/renderer
- **Tests:** Vitest

## Advertencia legal

Esta herramienta es de uso exclusivamente informativo. No constituye asesoría legal, no garantiza resultados y no reemplaza la orientación de un profesional de inmigración certificado.

## Documentación del proyecto

Toda la documentación se encuentra en el directorio padre (`../`):

- `00-MASTER-INSTRUCTIONS.md` — instrucciones de construcción (leer primero)
- `01-Marco-Legal.md.md` — marco legal completo
- `02-Variables.md.md` — variables del sistema
- `03-Reglas-Negocio.md.md` — reglas de negocio BR-001 a BR-075
- `04-Casos-Prueba.md.md` — 75+ casos de prueba
- `06-Arquitectura.md.md` — arquitectura técnica
- `07-Implementacion-MVP.md.md` — plan de implementación

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npx vitest run
```

## Variables de entorno

Crear `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Nunca** subir `.env.local` al repositorio.
