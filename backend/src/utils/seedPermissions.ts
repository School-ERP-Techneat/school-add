import prisma from "../config/prisma";

export async function seedPermission({
  schoolCode,
  module,
  roleId,
  can_create,
  can_delete,
  can_update,
  can_read,
}: {
  schoolCode: string;
  module: string;
  roleId: string;
  can_create: boolean;
  can_delete: boolean;
  can_update: boolean;
  can_read: boolean;
}) {
  try {
    const existing = await prisma.permission.findUnique({
      where: {
        roleId_module_schoolCode: {
          roleId,
          module,
          schoolCode,
        },
      },
    });

    if (!existing) {
      await prisma.permission.create({
        data: {
          roleId,
          module,
          schoolCode,
          can_create,
          can_delete,
          can_update,
          can_read,
        },
      });
    }
  } catch (error) {
    console.log("Error seeding permissions", error);
  }
}
