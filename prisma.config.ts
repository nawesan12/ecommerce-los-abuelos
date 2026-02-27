import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "prisma/config";

dotenvConfig({ path: ".env" });
dotenvConfig({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
});
