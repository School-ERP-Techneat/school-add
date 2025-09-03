/*
  Warnings:

  - Added the required column `schoolCode` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Batch" ADD COLUMN     "schoolCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_schoolCode_fkey" FOREIGN KEY ("schoolCode") REFERENCES "public"."School"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
