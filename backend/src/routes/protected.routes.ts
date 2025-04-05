import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.get("/protected", authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Acesso autorizado! ✅",
    user: req.user,
  });
});

export default router;
