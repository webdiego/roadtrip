import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

config({
  path: ".env.local",
});

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  throw new Error("TURSO_DATABASE_URL is not set");
}

if (!authToken) {
  throw new Error("TURSO_AUTH_TOKEN is not set");
}

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
}) satisfies Config;
