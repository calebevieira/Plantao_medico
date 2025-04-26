import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
  const role = req.user.role;

  if (role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.json(users);
}
