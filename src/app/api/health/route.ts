import { sql } from "drizzle-orm";
import { db } from "~/server/db";

export async function GET() {
  const [dbCheck] = await db.execute(sql`SELECT 'ok' AS health_check`);

  console.log("Database connection check:", dbCheck);
  return Response.json({
    status: "ok",
    dbCheck: dbCheck?.health_check,
    timestamp: new Date().toISOString(),
  });
}
