import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as ShiftController from "../controllers/shift.controller";


const router = Router();

router.post("/shifts", authenticate, ShiftController.createShift);
router.get("/shifts/mine", authenticate, ShiftController.getMyShifts);
router.put("/shifts/:id", authenticate, ShiftController.updateShift);
router.patch("/shifts/:id/cancel", authenticate, ShiftController.cancelShift);
router.patch("/shifts/:id", authenticate, ShiftController.updateShift);
router.patch("/shifts/:id/cancel", authenticate, ShiftController.cancelShift);
router.patch("/shifts/:id", authenticate, ShiftController.updateShift);



export default router;