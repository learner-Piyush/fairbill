import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load web/.env.local with dotenv
// Migrations use direct connection (DATABASE_URL); the app uses DATABASE_URL_POOLED at runtime.
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), "web/.env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
