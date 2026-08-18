import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const workerEnv = env as unknown as { DB?: D1Database };
  if (!workerEnv.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Configure the `DB` binding before using the database."
    );
  }

  return drizzle(workerEnv.DB, { schema });
}
