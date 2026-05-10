import {
  createProjectController,
  listProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/projects.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams } from "../middlewares/validate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
} from "../schemas/projects.schema";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProjectController,
);
router.get("/", authMiddleware, listProjectsController);
router.get(
  "/:id",
  authMiddleware,
  validateParams(projectParamsSchema),
  getProjectController,
);
router.put(
  "/:id",
  authMiddleware,
  validateParams(projectParamsSchema),
  validate(updateProjectSchema),
  updateProjectController,
);
router.delete(
  "/:id",
  authMiddleware,
  validateParams(projectParamsSchema),
  deleteProjectController,
);

export default router;
