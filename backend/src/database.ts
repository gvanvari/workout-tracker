import sqlite3 from 'sqlite3';
import path from 'path';

export function initializeDatabase(): sqlite3.Database {
  const dbPath = process.env.DB_PATH || './data.db';
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Database connection error:', err);
      process.exit(1);
    }
    console.log('✅ Database connected');
  });

  // Create tables
  db.serialize(() => {
    // Exercises table
    db.run(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        sets INTEGER NOT NULL,
        reps TEXT NOT NULL,
        weight REAL NOT NULL,
        rpe INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_exercises_date ON exercises(date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name)`);
  });

  return db;
}
