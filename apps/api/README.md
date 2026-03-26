# API Segurinite

## Variables de entorno

Crea un archivo `.env` en `apps/api` basado en `.env.example`:

- `DATABASE_URL`
- `WEB_ORIGIN` (ej. `http://localhost:3000`)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL_MINUTES` (default recomendado: `15`)
- `JWT_REFRESH_TTL_DAYS` (default recomendado: `30`)

## Autenticación (Admin)

Endpoints disponibles:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`

La autenticación usa cookies HTTPOnly:

- `access_token` (corta duración)
- `refresh_token` (larga duración si `rememberMe=true`)

## Generar hash para admin

```bash
node scripts/generar-hash-admin.mjs "MiPasswordSegura"
```

Con el hash resultante puedes insertar el admin en `usuarios`.

## Prisma

Comandos útiles:

```bash
npx prisma db pull --config prisma.config.ts
npx prisma generate --config prisma.config.ts
```
