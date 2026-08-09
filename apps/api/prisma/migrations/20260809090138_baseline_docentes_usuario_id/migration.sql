-- Baseline: documenta en el historial de Prisma Migrate cambios que ya fueron
-- aplicados manualmente (fuera de Prisma) a la base de datos:
--   - se agregó el valor DOCENTE al enum usuarios_rol
--   - se agregó docentes.usuario_id (FK única a usuarios, ON DELETE SET NULL)
-- Generada con `prisma migrate diff` (no con `migrate dev`, que pedía resetear
-- la base por el drift) y aplicada como ya-ejecutada vía
-- `prisma migrate resolve --applied`, sin volver a correr este SQL.

-- AlterEnum
ALTER TYPE "usuarios_rol" ADD VALUE 'DOCENTE';

-- AlterTable
ALTER TABLE "docentes" ADD COLUMN     "usuario_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "docentes_usuario_id_key" ON "docentes"("usuario_id");

-- AddForeignKey
ALTER TABLE "docentes" ADD CONSTRAINT "docentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
