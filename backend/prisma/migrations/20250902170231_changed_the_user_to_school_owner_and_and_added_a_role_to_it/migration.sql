/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Role" DROP CONSTRAINT "Role_schoolCode_fkey";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."SchoolOwner" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "SchoolOwner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolOwner_email_key" ON "public"."SchoolOwner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolOwner_schoolCode_key" ON "public"."SchoolOwner"("schoolCode");

-- AddForeignKey
ALTER TABLE "public"."SchoolOwner" ADD CONSTRAINT "SchoolOwner_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
