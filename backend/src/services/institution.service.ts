import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar nova instituição
export const createInstitution = async (data: { name: string; address: string }) => {
  return prisma.institution.create({ data });
};

// Listar todas as instituições (Admin)
export const getAllInstitutions = async () => {
  return prisma.institution.findMany({
    include: {
      userInstitutions: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

// Listar apenas as instituições que o usuário está vinculado (Médico)
export const getInstitutionsByUserId = async (userId: string) => {
  return prisma.institution.findMany({
    where: {
      userInstitutions: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      userInstitutions: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

// Criar vinculação de usuário e instituição
export const joinInstitution = async (userId: string, institutionId: string) => {
  const institution = await prisma.institution.findUnique({ where: { id: institutionId } });

  if (!institution) throw new Error("Instituição não encontrada.");

  return prisma.userInstitution.create({
    data: {
      userId,
      institutionId,
    },
  });
};
