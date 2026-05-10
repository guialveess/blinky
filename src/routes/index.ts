import { Router } from "express";
import authRoutes from "./auth.routes";
import projectsRoutes from "./projects.routes";
import linksRoutes from "./links.routes";
import parametersRoutes from "./parameters.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/projects", projectsRoutes);
routes.use("/links", linksRoutes);
routes.use("/parameters", parametersRoutes);

export default routes;
