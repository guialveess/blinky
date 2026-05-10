import Redis from "ioredis";
import { env } from "../env";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  password: env.REDIS_PASSWORD,
  tls: env.NODE_ENV === "production" ? {} : undefined,
});
