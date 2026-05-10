import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../services/projects.service";

export async function createProjectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { name, description } = req.body;

  try {
    const project = await createProject(userId, name, description);
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function listProjectsController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  try {
    const projects = await listProjects(userId);
    return res.status(200).json(projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function getProjectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  try {
    const project = await getProject(id, userId);
    if (!id) {
      return res.status(400).json({ message: "ID não fornecido" });
    }
    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function updateProjectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const { name, description } = req.body;
  try {
    const project = await updateProject(id, userId, { name, description });
    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteProjectController(req: Request, res: Response) {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  try {
    await deleteProject(id, userId);
    return res.status(200).json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
}
