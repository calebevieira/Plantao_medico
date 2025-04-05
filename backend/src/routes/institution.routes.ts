import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as InstitutionController from "../controllers/institution.controller";

const router = Router();

// Criar instituição (somente ADMIN)
router.post("/institutions", authenticate, InstitutionController.createInstitution);

// Listar todas instituições
router.get("/institutions", authenticate, InstitutionController.getAllInstitutions);

// Médico se vincular à instituição
router.patch("/institutions/:id/join", authenticate, InstitutionController.joinInstitution);

export default router;