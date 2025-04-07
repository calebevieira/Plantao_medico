import { PrismaClient, Role } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const register = async (
    name: string,
    email: string,
    password: string,
    role: Role = Role.MEDICO
  ) => {
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email já cadastrado");

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
    },
  });

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado");

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) throw new Error("Senha inválida");

  const token = generateToken(user.id, user.role);
  return { user, token };
};
