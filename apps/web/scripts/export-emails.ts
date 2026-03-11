import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL not set. Run with: npx tsx --env-file=.env.local scripts/export-emails.ts");
  process.exit(1);
}

const db = createClient({ url, authToken });

async function main() {
  const result = await db.execute("SELECT email, created_at FROM subscribers ORDER BY created_at");
  const rows = result.rows as unknown as { email: string; created_at: string }[];

  if (rows.length === 0) {
    console.log("No subscribers yet.");
    process.exit(0);
  }

  const format = process.argv[2];

  if (format === "--csv") {
    console.log("email,created_at");
    for (const r of rows) console.log(`${r.email},${r.created_at}`);
  } else {
    console.log(`${rows.length} subscriber(s):\n`);
    for (const r of rows) console.log(`  ${r.email}  (${r.created_at})`);
  }
}

main();
