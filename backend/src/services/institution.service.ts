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

// Atualizar instituição
export const updateInstitution = async (id: string, data: { name: string; address: string }) => {
  return prisma.institution.update({
    where: { id },
    data,
  });
};

// Buscar instituição pelo ID (Admin)
export const getInstitutionById = async (id: string) => {
  return prisma.institution.findUnique({
    where: { id },
  });
};

// Buscar instituição pelo ID e UserId (Médico)
export const getInstitutionByUserId = async (id: string, userId: string) => {
  return prisma.institution.findFirst({
    where: {
      id,
      userInstitutions: {
        some: {
          userId: userId,
        },
      },
    },
  });
};

// Deletar instituição (Novo!)
export const deleteInstitution = async (id: string) => {
  return prisma.institution.delete({
    where: { id },
  });
};
