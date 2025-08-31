/*
  Warnings:

  - A unique constraint covering the columns `[roleId,module,schoolCode]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Permission_roleId_module_key";

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_module_schoolCode_key" ON "public"."Permission"("roleId", "module", "schoolCode");
