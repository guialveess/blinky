import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../services/projects.service";
import { asyncHandler } from "../lib/async-handler";

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { name, description } = req.body;
  const project = await createProject(userId, name, description);
  res.status(201).json(project);
});

export const listProjectsController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const projects = await listProjects(userId);
  res.status(200).json(projects);
});

export const getProjectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const project = await getProject(id, userId);
  res.status(200).json(project);
});

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  const { name, description } = req.body;
  const project = await updateProject(id, userId, { name, description });
  res.status(200).json(project);
});

export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const { id } = req.params as { id: string };
  await deleteProject(id, userId);
  res.status(200).json({ message: "Projeto deletado com sucesso" });
});
