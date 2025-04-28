import { Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as InstitutionService from "../services/institution.service";

// Criar instituição
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

// Listar instituições
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

// Médico entra em uma instituição
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

// Atualizar instituição
export const updateInstitution = (async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, address } = req.body;
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Apenas administradores podem editar instituições." });
  }

  try {
    const updatedInstitution = await InstitutionService.updateInstitution(id, { name, address });
    res.status(200).json(updatedInstitution);
  } catch (err: any) {
    console.error('Erro ao atualizar instituição:', err);
    res.status(400).json({ error: "Erro ao atualizar instituição." });
  }
}) as unknown as RequestHandler;

// Buscar instituição pelo ID (novo!)
export const getInstitutionById = (async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const role = req.user.role;
  const userId = req.user.userId;

  try {
    let institution;

    if (role === "ADMIN") {
      institution = await InstitutionService.getInstitutionById(id);
    } else if (role === "MEDICO") {
      institution = await InstitutionService.getInstitutionByUserId(id, userId);

      if (!institution) {
        return res.status(403).json({ error: "Você não tem acesso a essa instituição." });
      }
    }

    if (!institution) {
      return res.status(404).json({ error: "Instituição não encontrada." });
    }

    res.status(200).json(institution);
  } catch (err: any) {
    console.error('Erro ao buscar instituição:', err);
    res.status(400).json({ error: "Erro ao buscar instituição." });
  }
}) as unknown as RequestHandler;
// Deletar instituição
export const deleteInstitution = (async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.status(403).json({ error: "Apenas administradores podem deletar instituições." });
  }

  try {
    await InstitutionService.deleteInstitution(id);
    res.status(200).json({ message: "Instituição deletada com sucesso." });
  } catch (err: any) {
    console.error('Erro ao deletar instituição:', err);
    res.status(400).json({ error: "Erro ao deletar instituição." });
  }
}) as unknown as RequestHandler;
// Deletar instituição (Admin)