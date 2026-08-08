-- CreateTable
CREATE TABLE "docentes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "fecha_nacimiento" DATE,
    "rfc" VARCHAR(13),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(255),
    "observaciones" VARCHAR(255),
    "foto_url" TEXT,
    "grupo_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_docentes_grupo_id" ON "docentes"("grupo_id");

-- AddForeignKey
ALTER TABLE "docentes" ADD CONSTRAINT "fk_docentes_grupo" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
