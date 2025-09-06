/*
  Warnings:

  - You are about to drop the column `username` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,schoolCode]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Admin_username_schoolCode_key";

-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Class" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_schoolCode_key" ON "public"."Admin"("email", "schoolCode");
