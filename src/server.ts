import "dotenv/config";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { env } from "./env/index";
import routes from "./routes";
import { openApiSpec } from "./docs/openapi";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});

app.use(
  "/docs",
  apiReference({
    url: "/openapi.json",
    theme: "deepSpace",
    darkMode: true,
    customCss: `
      :root, .dark-mode {
        --scalar-background-1: #000000;
        --scalar-background-2: #080808;
        --scalar-background-3: #111111;
        --scalar-background-accent: #000000;
      }
    `,
  }),
);

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`Rodando na porta ${env.PORT}...`);
});
