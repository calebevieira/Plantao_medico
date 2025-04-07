
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInstitution = async (data: { name: string; address: string }) => {
  return prisma.institution.create({ data });
};

export const getAllInstitutions = async () => {
  return prisma.institution.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }
    }
  });
};

export const joinInstitution = async (userId: string, institutionId: string) => {
  const institution = await prisma.institution.findUnique({ where: { id: institutionId } });

  if (!institution) throw new Error("Instituição não encontrada.");

  return prisma.user.update({
    where: { id: userId },
    data: { institutionId }
  });
};
