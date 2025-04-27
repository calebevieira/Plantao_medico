import { Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as InstitutionService from "../services/institution.service";

export const createInstitution = (async (req: AuthRequest, res: Response) => {
  const { name, address } = req.body;
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Apenas administradores podem criar instituições." });
  }

  try {
    const institution = await InstitutionService.createInstitution({ name, address });
    res.status(201).json(institution);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}) as unknown as RequestHandler;

export const getAllInstitutions = (async (req: AuthRequest, res: Response) => {
  const { role, userId } = req.user;

  try {
    let institutions;

    if (role === "ADMIN") {
      institutions = await InstitutionService.getAllInstitutions();
    } else if (role === "MEDICO") {
      institutions = await InstitutionService.getInstitutionsByUserId(userId);
    } else {
      return res.status(403).json({ error: "Não autorizado a visualizar instituições." });
    }

    res.status(200).json(institutions);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}) as unknown as RequestHandler;

export const joinInstitution = (async (req: AuthRequest, res: Response) => {
  const institutionId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await InstitutionService.joinInstitution(userId, institutionId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}) as unknown as RequestHandler;
