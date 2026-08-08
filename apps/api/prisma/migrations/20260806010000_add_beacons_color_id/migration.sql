-- AlterTable
ALTER TABLE "beacons" ADD COLUMN     "color_id" INTEGER;

-- CreateIndex
CREATE INDEX "idx_beacons_color_id" ON "beacons"("color_id");

-- AddForeignKey
ALTER TABLE "beacons" ADD CONSTRAINT "fk_beacons_color" FOREIGN KEY ("color_id") REFERENCES "colores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
