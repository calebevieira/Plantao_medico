import { Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as ShiftService from "../services/shift.service";

export const createShift = (async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const { date, startTime, endTime, location, institutionId } = req.body;

  try {
    if (!institutionId) {
      res.status(400).json({ error: "Instituição obrigatória para criar plantão." });
      return;
    }

    const shift = await ShiftService.createShift({
      userId,
      date,
      startTime,
      endTime,
      location,
      institutionId,
    });

    res.status(201).json(shift);
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar plantão." });
    return;
  }
}) as unknown as RequestHandler;

export const getMyShifts = (async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;

  try {
    const shifts = await ShiftService.getShiftsByUser(userId);
    res.status(200).json(shifts);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
}) as unknown as RequestHandler;

export const updateShift = (async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const role = req.user.role;
  const { date, startTime, endTime, location } = req.body;

  try {
    const updated = await ShiftService.updateShift(id, {
      userId,
      role,
      date,
      startTime,
      endTime,
      location,
    });
    res.json(updated);
    return;
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }
}) as unknown as RequestHandler;

export const cancelShift = (async (req: AuthRequest, res: Response) => {
  const shiftId = req.params.id;
  const userId = req.user.userId;
  const role = req.user.role;
  const { justification } = req.body;

  try {
    const shift = await ShiftService.cancelShift(shiftId, {
      userId,
      role,
      justification,
    });

    res.status(200).json(shift);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
}) as unknown as RequestHandler;
