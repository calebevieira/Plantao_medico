import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import * as UserController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Rotas públicas
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Rotas protegidas (somente ADMIN)
router.get("/users", authenticate, UserController.getAllUsers);
router.put("/users/:id", authenticate, UserController.updateUser);
router.delete("/users/:id", authenticate, UserController.deleteUser);

export default router;
