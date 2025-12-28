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
    // Workouts table - represents a workout session
    db.run(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        workoutName TEXT NOT NULL,
        startTime TEXT,
        endTime TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exercises table - exercises within a workout session
    db.run(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        name TEXT NOT NULL,
        sets INTEGER NOT NULL,
        setDetails TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_exercises_workoutId ON exercises(workoutId)`);
  });

  return db;
}
