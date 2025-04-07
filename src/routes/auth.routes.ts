import { Router } from "../../backend/node_modules/@types/express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
