import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as ShiftService from "../services/shift.service";

export const createShift = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const { date, startTime, endTime, location } = req.body;

  try {
    const shift = await ShiftService.createShift({ userId, date, startTime, endTime, location });
    res.status(201).json(shift);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyShifts = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;

  try {
    const shifts = await ShiftService.getShiftsByUser(userId);
    res.status(200).json(shifts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateShift = async (req: AuthRequest, res: Response) => {
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
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelShift = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;
    const { justification } = req.body;
  
    try {
      const result = await ShiftService.cancelShift(id, { userId, role, justification });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };  