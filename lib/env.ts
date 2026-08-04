import { z } from "zod";

const optionalServerString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z.object({
  DATABASE_URL: optionalServerString,
  DIRECT_URL: optionalServerString,
  CRON_SECRET: optionalServerString,
  PUPPETEER_EXECUTABLE_PATH: optionalServerString,
  TAVILY_API_KEY: optionalServerString,
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  });
}
