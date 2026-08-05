# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Segurinite is a student-safety tracking system: students (`alumnos`) are organized into groups (`grupos`), each wears a wristband (`pulsera`) that reports status, and staff monitor a live map/dashboard for alerts. It's a Turborepo monorepo with an npm workspaces setup:

- `apps/api` — NestJS backend (REST), Prisma ORM over MySQL/MariaDB.
- `apps/web` — Next.js 16 (App Router) frontend, React 19, Tailwind CSS 4.
- `packages/ui`, `packages/eslint-config`, `packages/typescript-config` — shared workspace packages (`@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`). `packages/ui` is currently just the unused create-turbo starter stub — the web app has its own `components/` instead.

All domain code (models, DTOs, variable names, UI copy, commit messages) is in **Spanish**; keep new code consistent with that.

## Commands

Run from the repo root unless noted. Turborepo fans these out to both apps via workspace filters (`--filter=web`, `--filter=api`).

```bash
npm run dev          # both apps in watch mode (web :3000, api :3001)
npm run build        # turbo build (web only defines a build task with caching)
npm run lint         # turbo lint across workspaces
npm run check-types  # turbo check-types across workspaces
npm run format       # prettier --write across the repo
```

Per-app (run inside `apps/api` or `apps/web`, or via `turbo run <task> --filter=api`):

```bash
# apps/api
npm run dev              # nest start --watch
npm run test              # jest unit tests (rootDir: src, pattern *.spec.ts)
npm run test:watch
npm run test:cov
npm run test:e2e          # jest --config ./test/jest-e2e.json
npx jest src/alumnos/alumnos.service.spec.ts   # run a single test file
npm run lint               # eslint --fix
npx prisma generate --config prisma.config.ts  # regenerate Prisma client after schema.prisma changes
npx prisma migrate dev --config prisma.config.ts --name <migration_name>
node scripts/generar-hash.mjs "MiPasswordSegura"   # generate an argon2 hash to manually seed an admin in `usuarios`

# apps/web
npm run dev          # next dev --port 3000
npm run lint          # eslint --max-warnings 0
npm run check-types    # next typegen && tsc --noEmit
```

Local MySQL for development: `docker-compose.yml` at the root brings up a `mysql:8.0` container using `DB_ROOT_PASSWORD`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` from `.env`. `apps/api` reads `DATABASE_URL` (and the JWT secrets/TTLs) from its own `apps/api/.env` — see `apps/api/.env.example`.

## Architecture

### API (`apps/api`, NestJS)

- Standard Nest module-per-domain layout: `alumnos/`, `grupos/`, `pulseras/`, `colores/`, `auth/`, each with `*.controller.ts`, `*.service.ts`, `*.module.ts`, and a `dto/` folder using `class-validator`/`class-transformer`. `main.ts` applies a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`, so DTOs are the strict contract for every request body.
- **Prisma**: schema at `apps/api/prisma/schema.prisma`, generated client output lives in `apps/api/src/generated/prisma` (checked into the source tree, not `node_modules`) — regenerate with `prisma generate` after any schema change, don't hand-edit generated files. `PrismaService` (`apps/api/prisma/prisma.service.ts`) connects via `@prisma/adapter-mariadb`, parsing `DATABASE_URL` manually rather than using Prisma's built-in URL handling.
- Prisma model/column names are `snake_case` (e.g. `alumno_contactos`, `fecha_nacimiento`, `grupo_id`); services translate between that and the `camelCase` JSON shape the API returns (see the `map*` private methods in each service, e.g. `AlumnosService.mapAlumno`). Numeric IDs that are `BigInt` in the DB (`alumnos.id`, `pulseras.id`) are serialized to strings in API responses; `grupos`/`colores` IDs stay as plain numbers.
- **Auth**: cookie-based JWT, no Passport — `auth/auth.service.ts` issues `access_token` (short TTL) and, when `rememberMe` is set at login, a `refresh_token` (long TTL, hashed with argon2 and stored on `usuarios.refresh_token_hash`). Both are `httpOnly` cookies set directly on the Express `Response`. `JwtCookieAuthGuard` (`auth/guards/jwt-cookie-auth.guard.ts`) reads `access_token` from the cookie, verifies it, and attaches the payload to `request.user`; apply it with `@UseGuards(JwtCookieAuthGuard)` per-controller (see `AlumnosController`) — there's no global guard. Passwords and refresh tokens are hashed with `argon2`, not bcrypt.
- Business invariants worth knowing before touching `alumnos`/`pulseras`: a `pulsera` must be in `CONECTADA` state and not already linked to another student before it can be assigned when creating an `alumno` (`AlumnosService.create`); creating an alumno flips the pulsera to `REGISTRADA` inside the same `$transaction`. `alumno_contactos` rows are typed `TUTOR` or `EMERGENCIA` with an `orden` used for uniqueness/sorting.

### Web (`apps/web`, Next.js App Router)

- Routes live under `app/groups/[grupoId]/...` (group detail, `docente` teacher view, live `mapa` map, `pulsera` pairing flow, `alumnos/[alumnoId]` student detail, `nuevo-registro` enrollment). `middleware.ts` gate-keeps `/` and `/groups/**` behind the presence of the `access_token` cookie, redirecting to `/login`.
- `lib/api/client.ts` is the single fetch wrapper (`apiFetch`) used for every backend call: it forwards cookies (including reading them from `next/headers` on the server), retries once via `POST /auth/refresh` on a 401, and redirects to `/login` if that also fails. Always go through this instead of calling `fetch` directly.
- `lib/api/segurinite.ts` is the API boundary: it calls the NestJS endpoints and maps the API's camelCase response shapes onto the `*Mock` types defined in `lib/mock/` (`AlumnoMock`, `GrupoMock`, ...). Those mock-prefixed types are the real, current domain types used throughout the UI — `lib/mock/` was the original hardcoded fixture layer and its type definitions were kept as the app's contract when real API integration replaced the fixtures. Don't be misled by the "mock" name into thinking it's dead/test-only code.
- The live map/alert system (`components/alertas/*`, `hooks/useSimuladorAlertas.ts`) is a **client-side simulation**: `useSimuladorAlertas` randomly fires fake alerts for students already in `alerta`/`peligro` state on a timer, purely for demo purposes — it is not wired to real wristband telemetry yet. `AlertasProvider` is the context/state owner; `AlertasBootstrap` wires the simulator in; `AlertasContainer`/`AlertaToast` render the toasts.
- Drag-and-drop (`@dnd-kit/core`) is used for assigning students to groups (see `AlumnoCardDraggable`, `DockAccionesAlumno`).
- Path alias `@/*` maps to the `apps/web` root (see `tsconfig.json`), used throughout instead of relative imports for anything outside the current directory.


## Estado conocido / pendiente
- `useSimuladorAlertas` es temporal — genera alertas falsas con timers para poder
  maquetar la UI sin datos reales. Al conectar el WebSocket de telemetría real
  (ver plan de MQTT/TimescaleDB), este hook se debe reemplazar, no coexistir con él.
- El docker-compose actual todavía levanta MySQL — hay una migración a Postgres +
  TimescaleDB + broker MQTT pendiente y documentada aparte.

  ## Qué evitar
- No agregues Redis todavía (fuera de alcance del MVP).
- No edites apps/api/src/generated/prisma a mano — se regenera con `prisma generate`.
- No mezcles convenciones: código/nombres en español, pero comentarios técnicos
  y este archivo pueden ir en inglés — no cambies el idioma de dominio existente.