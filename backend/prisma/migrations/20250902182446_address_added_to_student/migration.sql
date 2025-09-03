/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
