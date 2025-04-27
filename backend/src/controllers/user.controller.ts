import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

// Listar todos usuários
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

// Atualizar usuário
export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const role = req.user.role;

  if (role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  const { id } = req.params;
  const { name, email, role: newRole } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, role: newRole },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Deletar usuário
export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  const role = req.user.role;

  if (role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}