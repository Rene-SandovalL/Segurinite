-- CreateEnum
CREATE TYPE "pulseras_estado" AS ENUM ('DISPONIBLE', 'CONECTADA', 'REGISTRADA', 'ASIGNADA');

-- CreateEnum
CREATE TYPE "alumno_contactos_tipo" AS ENUM ('TUTOR', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "alumnos_tipo_sangre" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateEnum
CREATE TYPE "alumnos_estado" AS ENUM ('normal', 'alerta', 'peligro');

-- CreateEnum
CREATE TYPE "usuarios_rol" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "alumno_contactos" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "tipo" "alumno_contactos_tipo" NOT NULL,
    "orden" INTEGER,
    "parentesco" VARCHAR(30),
    "nombre" VARCHAR(120) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE,
    "direccion" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumno_contactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" BIGSERIAL NOT NULL,
    "grupo_id" INTEGER,
    "pulsera_id" BIGINT,
    "nombre" VARCHAR(60) NOT NULL,
    "apellido" VARCHAR(60) NOT NULL,
    "fecha_nacimiento" DATE,
    "tipo_sangre" "alumnos_tipo_sangre",
    "estado" "alumnos_estado" NOT NULL DEFAULT 'normal',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "color_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60),
    "valor_hex" CHAR(7) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pulseras" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(64) NOT NULL,
    "estado" "pulseras_estado" NOT NULL DEFAULT 'DISPONIBLE',
    "mac_address" VARCHAR(17),
    "bateria" INTEGER,
    "last_seen_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pulseras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "usuarios_rol" NOT NULL DEFAULT 'ADMIN',
    "refresh_token_hash" VARCHAR(255),
    "refresh_token_expires_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_contactos_alumno_id" ON "alumno_contactos"("alumno_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_contacto_tutor_orden" ON "alumno_contactos"("alumno_id", "tipo", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "uq_alumnos_pulsera_id" ON "alumnos"("pulsera_id");

-- CreateIndex
CREATE INDEX "idx_alumnos_grupo_id" ON "alumnos"("grupo_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_grupos_nombre" ON "grupos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "uq_grupos_color_id" ON "grupos"("color_id");

-- CreateIndex
CREATE INDEX "idx_grupos_color_id" ON "grupos"("color_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_colores_valor_hex" ON "colores"("valor_hex");

-- CreateIndex
CREATE UNIQUE INDEX "uq_pulseras_uuid" ON "pulseras"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uq_pulseras_mac" ON "pulseras"("mac_address");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usuarios_email" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "alumno_contactos" ADD CONSTRAINT "fk_contactos_alumno" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "fk_alumnos_grupo" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "fk_alumnos_pulsera" FOREIGN KEY ("pulsera_id") REFERENCES "pulseras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "fk_grupos_color" FOREIGN KEY ("color_id") REFERENCES "colores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
