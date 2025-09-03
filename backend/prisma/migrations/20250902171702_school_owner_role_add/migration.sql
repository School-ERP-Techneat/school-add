/*
  Warnings:

  - The values [parent,staff,superUser] on the enum `RoleName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleName_new" AS ENUM ('schoolOwner', 'admin', 'teacher', 'student');
ALTER TABLE "public"."Role" ALTER COLUMN "name" TYPE "public"."RoleName_new" USING ("name"::text::"public"."RoleName_new");
ALTER TYPE "public"."RoleName" RENAME TO "RoleName_old";
ALTER TYPE "public"."RoleName_new" RENAME TO "RoleName";
DROP TYPE "public"."RoleName_old";
COMMIT;
