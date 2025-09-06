import prisma from "../config/prisma";

export async function getBatchForSchool(schoolCode: string) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Start in July of current year
  const startDate = new Date(currentYear, 6, 1); // month is 0-indexed → 6 = July
  // End in June of next year
  const endDate = new Date(currentYear + 1, 5, 30); // 5 = June

  const yearLabel = `${currentYear}-${currentYear + 1}`;

  const existingBatch = await prisma.batch.findFirst({
    where: {
      OR: [
        {
          year: yearLabel,
        },
        {
          startDate,
          endDate,
        },
      ],
      schoolCode,
    },
  });

  if (existingBatch) return existingBatch;
  const batch = await prisma.batch.create({
    data: {
      year: yearLabel,
      startDate,
      endDate,
      schoolCode,
    },
  });

  return batch;
}
