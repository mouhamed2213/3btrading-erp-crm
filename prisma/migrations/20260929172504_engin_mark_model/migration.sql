/*
  Warnings:

  - You are about to drop the column `modele` on the `machines` table. All the data in the column will be lost.
  - The `marque` column on the `machines` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `machines` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EngineType" AS ENUM ('EXCAVATOR', 'MINI_EXCAVATOR', 'BACKHOE_LOADER', 'WHEEL_LOADER', 'TRACK_LOADER', 'BULLDOZER', 'MOTOR_GRADER', 'SKID_STEER', 'TELEHANDLER', 'AERIAL_WORK_PLATFORM', 'MOBILE_CRANE', 'TOWER_CRANE', 'CRANE_TRUCK', 'FORKLIFT', 'DUMPER', 'TIPPER_TRUCK', 'SOIL_COMPACTOR', 'TANDEM_ROLLER', 'ASPHALT_PAVER', 'CONCRETE_MIXER_TRUCK', 'CONCRETE_PUMP', 'GENERATOR', 'COMPRESSOR');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('CATERPILLAR', 'KOMATSU', 'VOLVO_CE', 'LIEBHERR', 'HITACHI', 'JOHN_DEERE', 'JCB', 'CASE', 'WACKER_NEUSON', 'BOMAG', 'SANY', 'XCMG', 'ZOOMLION', 'HYUNDAI', 'KUBOTA', 'BOBCAT', 'MANITOU', 'HAULOTTE', 'HAMM', 'VOGELE');

-- AlterTable
ALTER TABLE "machines" DROP COLUMN "modele",
DROP COLUMN "type",
ADD COLUMN     "type" "EngineType" NOT NULL,
DROP COLUMN "marque",
ADD COLUMN     "marque" "Brand";
