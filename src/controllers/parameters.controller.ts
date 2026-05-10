import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createParameter,
  listParameters,
  deleteParameter,
} from "../services/parameters.service";

export async function createParameterController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { key, value } = req.body;

  try {
    const parameter = await createParameter(userId, key, value);
    return res.status(201).json(parameter);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function listParametersController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;

  try {
    const parameters = await listParameters(userId);
    return res.status(200).json(parameters);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteParameterController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };

  try {
    await deleteParameter(id, userId);
    return res.status(200).json({ message: "Parâmetro deletado com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}
