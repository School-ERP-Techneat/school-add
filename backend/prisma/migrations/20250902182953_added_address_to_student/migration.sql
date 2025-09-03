/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_addressId_key" ON "public"."Student"("addressId");
