import type { Request, Response } from "express";
import { login, register } from "../services/auth.service";
import { asyncHandler } from "../lib/async-handler";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await register(name, email, password);
  res.status(201).json(user);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  res.status(200).json(user);
});
