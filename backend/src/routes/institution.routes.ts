import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface estendida para incluir o usuário
export interface AuthRequest extends Request {
  user?: any;
}

// Aqui é a função de autenticação com tipos explícitos e compatíveis
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
};
