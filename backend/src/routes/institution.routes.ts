import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as InstitutionController from "../controllers/institution.controller";

const router = Router();

// ❌ Remover "institutions" duplicado dos caminhos
router.post("/", authenticate, InstitutionController.createInstitution);
router.get("/", authenticate, InstitutionController.getAllInstitutions);
router.patch("/:id/join", authenticate, InstitutionController.joinInstitution);

export default router;
