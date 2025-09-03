/*
  Warnings:

  - You are about to drop the column `schoolCode` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId,module]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolCode` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_schoolCode_fkey";

-- DropIndex
DROP INDEX "public"."Permission_roleId_module_schoolCode_key";

-- AlterTable
ALTER TABLE "public"."Permission" DROP COLUMN "schoolCode";

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "schoolCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_module_key" ON "public"."Permission"("roleId", "module");

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_schoolCode_fkey" FOREIGN KEY ("schoolCode") REFERENCES "public"."School"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
