import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const isInstitutionAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const institutionId = req.params.institutionId || req.body.institutionId;

    if (!institutionId) {
      res.status(400).json({ error: "ID da instituição não informado." });
      return;
    }

    const institutionAdmin = await prisma.userInstitution.findFirst({
      where: {
        userId,
        institutionId,
        user: {
          role: "ADMIN",
        },
      },
    });

    if (!institutionAdmin) {
      res.status(403).json({ error: "Acesso negado: você não é administrador desta instituição." });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no middleware de permissão." });
  }
};
