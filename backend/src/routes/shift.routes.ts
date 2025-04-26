import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { isInstitutionAdmin } from "../middlewares/institution-admin.middleware"; //
import * as ShiftController from "../controllers/shift.controller";

const router = Router();

// Criar plantão - protegido por autenticação e verificação de admin da instituição
router.post(
  "/",
  authenticate,
  isInstitutionAdmin,
  ShiftController.createShift
);

// Buscar plantões do médico logado
router.get(
  "/mine",
  authenticate,
  ShiftController.getMyShifts
);

// Atualizar plantão
router.put(
  "/:id",
  authenticate,
  ShiftController.updateShift
);

// Cancelar plantão
router.patch(
  "/:id/cancel",
  authenticate,
  ShiftController.cancelShift
);

export default router;
