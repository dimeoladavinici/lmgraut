import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
    return open({
        filename: "./db/database.sqlite",
        driver: sqlite3.Database
    });
}

export async function initDB() {
    const db = await openDB();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estado TEXT,
      tipo TEXT,
      nombre TEXT,
      anio INTEGER,
      km TEXT,
      vendido INTEGER DEFAULT 0,
      foto1 TEXT,
      foto2 TEXT,
      foto3 TEXT,
      foto4 TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
