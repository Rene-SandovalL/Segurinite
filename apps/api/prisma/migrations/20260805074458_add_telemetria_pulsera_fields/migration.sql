-- AlterTable
ALTER TABLE "pulseras" ADD COLUMN     "ultima_temp" DECIMAL(4,1),
ADD COLUMN     "ultimo_beacon_id" INTEGER,
ADD COLUMN     "ultimo_bpm" INTEGER,
ADD COLUMN     "ultimo_spo2" DECIMAL(4,1);
