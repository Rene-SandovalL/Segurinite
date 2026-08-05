-- CreateEnum
CREATE TYPE "zona_tipo" AS ENUM ('SALON', 'AREA_COMUN', 'ENTRADA', 'OTRO');

-- CreateTable
CREATE TABLE "zonas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "tipo" "zona_tipo" NOT NULL DEFAULT 'SALON',
    "grupo_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mapas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "imagen_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beacons" (
    "id" SERIAL NOT NULL,
    "beacon_id" INTEGER NOT NULL,
    "zona_id" INTEGER NOT NULL,
    "mapa_id" INTEGER,
    "nombre" VARCHAR(60),
    "pos_x" DECIMAL(5,4),
    "pos_y" DECIMAL(5,4),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beacons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_zonas_grupo_id" ON "zonas"("grupo_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_beacons_beacon_id" ON "beacons"("beacon_id");

-- CreateIndex
CREATE INDEX "idx_beacons_zona_id" ON "beacons"("zona_id");

-- CreateIndex
CREATE INDEX "idx_beacons_mapa_id" ON "beacons"("mapa_id");

-- AddForeignKey
ALTER TABLE "zonas" ADD CONSTRAINT "fk_zonas_grupo" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beacons" ADD CONSTRAINT "fk_beacons_zona" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beacons" ADD CONSTRAINT "fk_beacons_mapa" FOREIGN KEY ("mapa_id") REFERENCES "mapas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
