-- AlterTable
ALTER TABLE "beacons" ADD COLUMN     "mac_address" VARCHAR(17);

-- CreateIndex
CREATE UNIQUE INDEX "uq_beacons_mac_address" ON "beacons"("mac_address");
