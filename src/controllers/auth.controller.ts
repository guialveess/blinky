import { login, register } from "../services/auth.service";
import type { Request, Response } from "express";

export async function registerController(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const user = await register(name, email, password);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await login(email, password);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
