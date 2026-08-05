---
paths:
  - "apps/api/**/*.ts"
---
# Backend NestJS

- Todo módulo nuevo sigue el patrón: `*.module.ts`, `*.controller.ts`,
  `*.service.ts`, `dto/*.dto.ts` — ver `apps/api/src/alumnos/` como referencia.
- Los datos que llegan de MQTT SIEMPRE pasan por un DTO + class-validator antes
  de tocar la base de datos, igual que las peticiones HTTP.
- Prisma: nunca edites `src/generated/prisma` a mano, es generado.