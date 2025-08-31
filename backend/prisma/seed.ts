import { PrismaClient } from "@prisma/client";
import { getSuperuserRole } from "../src/utils/findRole";
const prisma = new PrismaClient();

async function seedRoles() {
  await prisma.role.createMany({
    data: [
      {
        name: "superUser", // Must match your RoleName enum
        description: "Can create School and manage admins.",
      },
      {
        name: "admin", // Must match your RoleName enum
        description:
          "Full access to the system and can manage users, permissions, and settings.",
      },
      {
        name: "teacher",
        description: "Can manage courses, students, and grades.",
      },
      {
        name: "student",
        description: "Can access course materials and view grades.",
      },
    ],
    skipDuplicates: true, // Prevents errors if they already exist
  });

  console.log("Roles created successfully!");
}

seedRoles()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

