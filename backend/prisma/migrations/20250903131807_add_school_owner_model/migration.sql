/*
  Warnings:

  - You are about to drop the column `userId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Student` table. All the data in the column will be lost.
  - Made the column `batchId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "public"."School" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "classId",
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "aadhar" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "batchId" SET NOT NULL,
ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
