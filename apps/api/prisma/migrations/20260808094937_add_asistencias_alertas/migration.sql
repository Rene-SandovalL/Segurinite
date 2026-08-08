-- CreateEnum
CREATE TYPE "asistencia_estado" AS ENUM ('PRESENTE', 'AUSENTE', 'TARDANZA');

-- CreateEnum
CREATE TYPE "alerta_tipo" AS ENUM ('BPM_ALTO', 'BPM_BAJO', 'SPO2_BAJO', 'TEMP_ANOMALA', 'SIN_SENAL');

-- CreateEnum
CREATE TYPE "alerta_severidad" AS ENUM ('ALERTA', 'PELIGRO');

-- CreateTable
CREATE TABLE "asistencias" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "primera_deteccion" TIMESTAMP(0),
    "ultima_deteccion" TIMESTAMP(0),
    "estado" "asistencia_estado" NOT NULL DEFAULT 'AUSENTE',
    "confirmado_manual" BOOLEAN NOT NULL DEFAULT false,
    "confirmado_por" BIGINT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "tipo" "alerta_tipo" NOT NULL,
    "severidad" "alerta_severidad" NOT NULL DEFAULT 'ALERTA',
    "valor" DECIMAL(5,2),
    "beacon_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resuelta_at" TIMESTAMP(0),
    "resuelta_por" BIGINT,
    "notas" VARCHAR(255),

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_asistencias_fecha" ON "asistencias"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "uq_asistencias_alumno_fecha" ON "asistencias"("alumno_id", "fecha");

-- CreateIndex
CREATE INDEX "idx_alertas_alumno_created_at" ON "alertas"("alumno_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_alertas_created_at" ON "alertas"("created_at");

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "fk_asistencias_alumno" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "fk_asistencias_confirmado_por" FOREIGN KEY ("confirmado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "fk_alertas_alumno" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "fk_alertas_resuelta_por" FOREIGN KEY ("resuelta_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
