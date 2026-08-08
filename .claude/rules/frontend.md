---
paths:
  - "apps/web/**/*.tsx"
  - "apps/web/**/*.ts"
---
# Reglas de frontend — SeguriNite

## Antes de crear cualquier componente nuevo
SIEMPRE revisa primero qué ya existe en `apps/web/components/` que se le parezca,
aunque sea de otro dominio (ej. si vas a hacer una card para beacons, mira cómo está
hecha `components/alumnos/alumno-vitales.tsx` o las cards de `components/grupos/`
antes de inventar un patrón nuevo). El objetivo es coherencia visual, no la solución
"más limpia en abstracto" — si el resto de la app usa un patrón, síguelo aunque no
sea el que tú elegirías desde cero.

## Convenciones de estilo ya establecidas (no las rompas)
- El proyecto usa MAYORITARIAMENTE estilos inline (`style={{ ... }}`) combinados con
  clases sueltas de Tailwind para layout (`flex`, `w-full`, etc.), no un sistema de
  componentes de UI tipo shadcn. `packages/ui` es un stub sin usar — no lo actives
  ni construyas sobre él a menos que se pida explícitamente.
- Variables de color centralizadas en `apps/web/app/globals.css` como custom
  properties CSS (`--color-fondo-app`, `--color-acento`, `--color-borde`, etc.) —
  úsalas (`var(--color-acento)`) en vez de hardcodear hex nuevos para lo que ya
  tiene variable. Si necesitas un color nuevo que no existe ahí, agrégalo a
  `:root` en globals.css en vez de dejarlo solo hardcodeado en el componente.
- Patrón de "card oscura" ya usado (ver `alumno-vitales.tsx`): fondo `#3A3A3A`,
  bordes redondeados grandes (`borderRadius: 22`), acento en borde con el color de
  marca `#575EAA`. Reutiliza este lenguaje visual para cualquier card nueva
  relacionada a datos en vivo (vitales, estado de beacon, etc.).
- Fuente del proyecto: Lato (`var(--font-lato)`), ya configurada globalmente — no
  la sobrescribas por componente.
- Nomenclatura de dominio en español (`crear-grupo.tsx`, `alumno-vitales.tsx`) —
  mantén nombres de archivos/componentes/props en español, consistente con el
  resto del código.

## Drag and drop
Ya existe `@dnd-kit/core` como dependencia, usado en `AlumnoCardDraggable` /
`DockAccionesAlumno` para arrastrar alumnos a grupos. Para el drag de beacons sobre
el mapa, usa la MISMA librería con el mismo patrón de sensores/contexto que ya
está implementado ahí — no introduzcas una librería de drag-and-drop distinta.

## Llamadas al backend
SIEMPRE a través de `lib/api/client.ts` (`apiFetch`) — nunca `fetch` directo. Este
wrapper ya maneja cookies, refresh de token en 401, y redirect a /login. Los tipos
de dominio que usa toda la UI están en `lib/mock/` (a pesar del nombre, NO es
código muerto — son el contrato de tipos real, ver nota en CLAUDE.md principal).

## Qué NO hacer
- No agregues una librería de componentes UI nueva (Radix, shadcn, MUI, etc.) sin
  que se pida explícitamente — el proyecto ya tiene su propio lenguaje visual.
- No uses `localStorage`/`sessionStorage` para nada del estado del mapa o modo
  edición — todo el estado vive en React (Context/estado local) o se persiste al
  backend.