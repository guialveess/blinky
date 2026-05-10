import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from "../services/redirects.service";

export async function createRedirectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { redirectUrl } = req.body;

  try {
    const redirect = await createRedirect(linkId, userId, redirectUrl);
    return res.status(201).json(redirect);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function updateRedirectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { redirectUrl } = req.body;

  try {
    const redirect = await updateRedirect(linkId, userId, redirectUrl);
    return res.status(200).json(redirect);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteRedirectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };

  try {
    await deleteRedirect(linkId, userId);
    return res.status(200).json({ message: "Redirect removido com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}
