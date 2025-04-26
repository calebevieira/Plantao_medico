import { prisma } from "../lib/prisma";

export interface CreateShiftData {
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  institutionId: string; // ✅ Novo campo adicionado aqui
}

export const createShift = async (data: CreateShiftData) => {
  const { userId, date, startTime, endTime, location, institutionId } = data;

  const shift = await prisma.shift.create({
    data: {
      title: "Plantão", // Pode ajustar depois se quiser título personalizado
      date,
      startTime,
      endTime,
      location,
      userId,
      institutionId,
    },
  });

  return shift;
};

export const getShiftsByUser = async (userId: string) => {
  return prisma.shift.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
};

export const updateShift = async (id: string, data: any) => {
  return prisma.shift.update({
    where: { id },
    data,
  });
};

export const cancelShift = async (id: string, data: any) => {
  return prisma.shift.update({
    where: { id },
    data: {
      ...data,
      status: "CANCELED",
    },
  });
};
