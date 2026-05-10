import * as z from "zod";

const envSchema = z.object({
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
