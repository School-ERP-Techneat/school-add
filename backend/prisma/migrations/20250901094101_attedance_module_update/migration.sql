/*
  Warnings:

  - Added the required column `classId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_teacherId_fkey";

-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "street" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "sectionId" TEXT NOT NULL,
ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
