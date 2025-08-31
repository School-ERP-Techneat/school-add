/*
  Warnings:

  - Added the required column `schoolCode` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Permission" ADD COLUMN     "schoolCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_schoolCode_fkey" FOREIGN KEY ("schoolCode") REFERENCES "public"."School"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
