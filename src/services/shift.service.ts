import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateShiftData {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

export const createShift = async (data: CreateShiftData) => {
  return prisma.shift.create({
    data: {
      userId: data.userId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
    },
  });
};

export const getShiftsByUser = async (userId: string) => {
  return prisma.shift.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
};

export const updateShift = async (
    shiftId: string,
    {
      userId,
      role,
      date,
      startTime,
      endTime,
      location,
    }: {
      userId: string;
      role: string;
      date: string;
      startTime: string;
      endTime: string;
      location: string;
    }
  ) => {
    const existing = await prisma.shift.findUnique({ where: { id: shiftId } });
  
    if (!existing) throw new Error("Plantão não encontrado");
  
    if (existing.userId !== userId && role !== "ADMIN") {
      throw new Error("Você não tem permissão para editar este plantão");
    }
  
    return prisma.shift.update({
      where: { id: shiftId },
      data: {
        date: new Date(date),
        startTime,
        endTime,
        location,
      },
    });
  };
  export const cancelShift = async (
    shiftId: string,
    {
      userId,
      role,
      justification,
    }: {
      userId: string;
      role: string;
      justification: string;
    }
  ) => {
    const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
  
    if (!shift) throw new Error("Plantão não encontrado");
  
    if (shift.userId !== userId && role !== "ADMIN") {
      throw new Error("Você não tem permissão para cancelar este plantão");
    }
  
    return prisma.shift.update({
      where: { id: shiftId },
      data: {
        status: "CANCELED",
        justification,
      },
    });
  };
  