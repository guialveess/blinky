import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createParameter,
  listParameters,
  deleteParameter,
} from "../services/parameters.service";
import { asyncHandler } from "../lib/async-handler";

export const createParameterController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { key, value } = req.body;
  const parameter = await createParameter(userId, key, value);
  res.status(201).json(parameter);
});

export const listParametersController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const parameters = await listParameters(userId);
  res.status(200).json(parameters);
});

export const deleteParameterController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  await deleteParameter(id, userId);
  res.status(200).json({ message: "Parâmetro deletado com sucesso" });
});
