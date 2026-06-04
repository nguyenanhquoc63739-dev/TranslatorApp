import * as SQLite from "expo-sqlite";

let databasePromise;

const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("translator.db");
  }

  const database = await databasePromise;

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS translation_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      originalText TEXT NOT NULL,
      translatedText TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);

  return database;
};

export const saveLocalHistoryItem = async (originalText, translatedText) => {
  const database = await getDatabase();

  await database.runAsync(
    `INSERT INTO translation_history (originalText, translatedText, createdAt)
     VALUES (?, ?, ?);`,
    originalText,
    translatedText,
    Date.now(),
  );
};

export const loadLocalHistoryItems = async () => {
  const database = await getDatabase();
  const rows = await database.getAllAsync(
    `SELECT id, originalText, translatedText
     FROM translation_history
     ORDER BY createdAt DESC;`,
  );

  return rows.map((row) => ({
    id: String(row.id),
    originalText: row.originalText,
    translatedText: row.translatedText,
  }));
};

export const clearLocalHistoryItems = async () => {
  const database = await getDatabase();

  await database.runAsync("DELETE FROM translation_history;");
};
