import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams } from "../middlewares/validate.middleware";
import { createParameterSchema, parameterParamsSchema } from "../schemas/parameters.schema";
import {
  createParameterController,
  listParametersController,
  deleteParameterController,
} from "../controllers/parameters.controller";

const router = Router();

router.post("/", authMiddleware, validate(createParameterSchema), createParameterController);
router.get("/", authMiddleware, listParametersController);
router.delete(
  "/:id",
  authMiddleware,
  validateParams(parameterParamsSchema),
  deleteParameterController,
);

export default router;
