/*
  Warnings:

  - A unique constraint covering the columns `[classTeacherId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - Made the column `schoolCode` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Teacher" DROP CONSTRAINT "Teacher_schoolCode_fkey";

-- AlterTable
ALTER TABLE "public"."Teacher" ALTER COLUMN "schoolCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Section_classTeacherId_key" ON "public"."Section"("classTeacherId");

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_schoolCode_fkey" FOREIGN KEY ("schoolCode") REFERENCES "public"."School"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
