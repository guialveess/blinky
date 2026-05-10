import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams, validateQuery } from "../middlewares/validate.middleware";
import {
  createLinkSchema,
  updateLinkSchema,
  linkParamsSchema,
  listLinksQuerySchema,
  addParameterToLinkSchema,
  linkParameterParamsSchema,
} from "../schemas/links.schema";
import { createRedirectSchema, updateRedirectSchema } from "../schemas/redirects.schema";
import {
  createLinkController,
  listLinksController,
  getLinkController,
  updateLinkController,
  deleteLinkController,
  addParameterToLinkController,
  removeParameterFromLinkController,
  generateLinkController,
} from "../controllers/links.controller";
import {
  createRedirectController,
  updateRedirectController,
  deleteRedirectController,
} from "../controllers/redirects.controller";

const router = Router();

router.post("/", authMiddleware, validate(createLinkSchema), createLinkController);
router.get("/", authMiddleware, validateQuery(listLinksQuerySchema), listLinksController);
router.get("/:id", authMiddleware, validateParams(linkParamsSchema), getLinkController);
router.put(
  "/:id",
  authMiddleware,
  validateParams(linkParamsSchema),
  validate(updateLinkSchema),
  updateLinkController,
);
router.delete(
  "/:id",
  authMiddleware,
  validateParams(linkParamsSchema),
  deleteLinkController,
);

router.get(
  "/:id/generate",
  authMiddleware,
  validateParams(linkParamsSchema),
  generateLinkController,
);

router.post(
  "/:id/parameters",
  authMiddleware,
  validateParams(linkParamsSchema),
  validate(addParameterToLinkSchema),
  addParameterToLinkController,
);
router.delete(
  "/:id/parameters/:parameterId",
  authMiddleware,
  validateParams(linkParameterParamsSchema),
  removeParameterFromLinkController,
);

router.post(
  "/:id/redirect",
  authMiddleware,
  validateParams(linkParamsSchema),
  validate(createRedirectSchema),
  createRedirectController,
);
router.put(
  "/:id/redirect",
  authMiddleware,
  validateParams(linkParamsSchema),
  validate(updateRedirectSchema),
  updateRedirectController,
);
router.delete(
  "/:id/redirect",
  authMiddleware,
  validateParams(linkParamsSchema),
  deleteRedirectController,
);

export default router;
