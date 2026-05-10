import * as z from "zod";

const envSchema = z.object({
  APP_URL: z.string().default("http://localhost:3333"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string().nonempty(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3333"),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", z.treeifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;
