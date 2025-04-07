import { Request, Response } from "../../backend/node_modules/@types/express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await AuthService.register(name, email, password, role);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await AuthService.login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
