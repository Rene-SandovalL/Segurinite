-- CreateTable
CREATE TABLE "configuracion_horario" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hora_entrada" TIME NOT NULL,
    "hora_salida" TIME NOT NULL,
    "tolerancia_tardanza_minutos" INTEGER NOT NULL DEFAULT 10,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_alertas" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "temp_alerta_min" DECIMAL(4,1) NOT NULL DEFAULT 34.0,
    "temp_normal_min" DECIMAL(4,1) NOT NULL DEFAULT 35.0,
    "temp_normal_max" DECIMAL(4,1) NOT NULL DEFAULT 38.0,
    "temp_alerta_max" DECIMAL(4,1) NOT NULL DEFAULT 40.0,
    "bpm_alto" INTEGER NOT NULL DEFAULT 140,
    "contador_temp" INTEGER NOT NULL DEFAULT 3,
    "contador_vital_cero" INTEGER NOT NULL DEFAULT 8,
    "contador_fuera_zona" INTEGER NOT NULL DEFAULT 8,
    "sin_senal_segundos" INTEGER NOT NULL DEFAULT 45,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_alertas_pkey" PRIMARY KEY ("id")
);

-- Seed: fila única (id=1) con los valores default, para que el sistema siga
-- funcionando idéntico a como está ahora hasta que alguien cambie algo desde
-- la UI de Configuración. hora_entrada/hora_salida no tienen @default en el
-- schema (son NOT NULL sin valor implícito), así que se fijan aquí a un
-- horario escolar típico (07:00–14:00).
INSERT INTO "configuracion_horario" ("id", "hora_entrada", "hora_salida", "tolerancia_tardanza_minutos", "updated_at")
VALUES (1, '07:00:00', '14:00:00', 10, CURRENT_TIMESTAMP);

INSERT INTO "configuracion_alertas" ("id", "updated_at")
VALUES (1, CURRENT_TIMESTAMP);
