import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let _initialized = false;

async function init() {
  if (_initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  _initialized = true;
}

export async function addSubscriber(email: string): Promise<{ ok: boolean; error?: string }> {
  await init();
  try {
    await db.execute({ sql: "INSERT INTO subscribers (email) VALUES (?)", args: [email] });
    return { ok: true };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return { ok: false, error: "already_subscribed" };
    }
    throw err;
  }
}
