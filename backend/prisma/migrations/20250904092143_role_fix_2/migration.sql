/*
  Warnings:

  - A unique constraint covering the columns `[name,schoolCode]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_name_schoolCode_key" ON "public"."Role"("name", "schoolCode");
