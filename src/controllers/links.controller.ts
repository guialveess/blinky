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

export async function createLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { projectId, name, baseUrl } = req.body;

  try {
    const link = await createLink(userId, projectId, name, baseUrl);
    return res.status(201).json(link);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function listLinksController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { projectId } = req.query as { projectId: string };

  try {
    const links = await listLinks(userId, projectId);
    return res.status(200).json(links);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function getLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };

  try {
    const link = await getLink(id, userId);
    return res.status(200).json(link);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function updateLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const { name, baseUrl } = req.body;

  try {
    const link = await updateLink(id, userId, { name, baseUrl });
    return res.status(200).json(link);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };

  try {
    await deleteLink(id, userId);
    return res.status(200).json({ message: "Link deletado com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function addParameterToLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId } = req.params as { id: string };
  const { parameterId } = req.body;

  try {
    const association = await addParameterToLink(linkId, parameterId, userId);
    return res.status(201).json(association);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function removeParameterFromLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id: linkId, parameterId } = req.params as { id: string; parameterId: string };

  try {
    await removeParameterFromLink(linkId, parameterId, userId);
    return res.status(200).json({ message: "Parâmetro removido do link com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function generateLinkController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };

  try {
    const result = await generateLink(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}
