// src/routes/institution.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as InstitutionController from "../controllers/institution.controller";

const router = Router();

router.post("/institutions", authenticate, InstitutionController.createInstitution);
router.get("/institutions", authenticate, InstitutionController.getAllInstitutions);
router.patch("/institutions/:id/join", authenticate, InstitutionController.joinInstitution);

export default router;
