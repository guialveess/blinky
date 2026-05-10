import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createLink,
  listLinks,
  getLink,
  updateLink,
  deleteLink,
  addParameterToLink,
  removeParameterFromLink,
  generateLink,
} from "../services/links.service";
import { asyncHandler } from "../lib/async-handler";

export const createLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { projectId, name, baseUrl } = req.body;
  const link = await createLink(userId, projectId, name, baseUrl);
  res.status(201).json(link);
});

export const listLinksController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { projectId } = req.query as { projectId: string };
  const links = await listLinks(userId, projectId);
  res.status(200).json(links);
});

export const getLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const link = await getLink(id, userId);
  res.status(200).json(link);
});

export const updateLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const { name, baseUrl } = req.body;
  const link = await updateLink(id, userId, { name, baseUrl });
  res.status(200).json(link);
});

export const deleteLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  await deleteLink(id, userId);
  res.status(200).json({ message: "Link deletado com sucesso" });
});

export const addParameterToLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { parameterId } = req.body;
  const association = await addParameterToLink(linkId, parameterId, userId);
  res.status(201).json(association);
});

export const removeParameterFromLinkController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;
    const { id: linkId, parameterId } = req.params as { id: string; parameterId: string };
    await removeParameterFromLink(linkId, parameterId, userId);
    res.status(200).json({ message: "Parâmetro removido do link com sucesso" });
  },
);

export const generateLinkController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const result = await generateLink(id, userId);
  res.status(200).json(result);
});
