import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from "../services/redirects.service";
import { asyncHandler } from "../lib/async-handler";

export const createRedirectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { redirectUrl } = req.body;
  const redirect = await createRedirect(linkId, userId, redirectUrl);
  res.status(201).json(redirect);
});

export const updateRedirectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { redirectUrl } = req.body;
  const redirect = await updateRedirect(linkId, userId, redirectUrl);
  res.status(200).json(redirect);
});

export const deleteRedirectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  await deleteRedirect(linkId, userId);
  res.status(200).json({ message: "Redirect removido com sucesso" });
});
