import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface ExerciseInput {
  name: string;
  sets: number;
  setDetails: Array<{ weight: number; reps: number; rpe: number }>;
  notes?: string;
}

export interface Exercise {
  id: number;
  workoutId: number;
  name: string;
  sets: number;
  setDetails: Array<{ weight: number; reps: number; rpe: number }>;
  notes?: string;
  created_at: string;
}

export class ExerciseDAO {
  private dbAll: (sql: string, params?: unknown[]) => Promise<unknown[]>;
  private dbGet: (sql: string, params?: unknown[]) => Promise<unknown>;
  private dbRun: (sql: string, params?: unknown[]) => Promise<{ lastID: number; changes: number }>;

  constructor(private db: sqlite3.Database) {
    this.dbAll = promisify(db.all.bind(db));
    this.dbGet = promisify(db.get.bind(db));
    this.dbRun = promisify(db.run.bind(db));
  }

  /**
   * Create a new exercise for a workout
   */
  async createExercise(workoutId: number, exercise: ExerciseInput): Promise<number> {
    const result = await this.dbRun(
      'INSERT INTO exercises (workoutId, name, sets, setDetails, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        workoutId,
        exercise.name,
        exercise.sets,
        JSON.stringify(exercise.setDetails),
        exercise.notes || null,
        new Date().toISOString()
      ]
    );
    return result.lastID;
  }

  /**
   * Get exercise by ID
   */
  async getExerciseById(id: number): Promise<Exercise | undefined> {
    const row = await this.dbGet('SELECT * FROM exercises WHERE id = ?', [id]);
    const exercise = row as Exercise | undefined;
    if (exercise && typeof exercise.setDetails === 'string') {
      exercise.setDetails = JSON.parse(exercise.setDetails);
    }
    return exercise;
  }

  /**
   * Get all exercises for a specific workout
   */
  async getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]> {
    const rows = await this.dbAll(
      'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
      [workoutId]
    );
    const exercises = (rows as Exercise[]) || [];
    exercises.forEach((ex) => {
      if (typeof ex.setDetails === 'string') {
        ex.setDetails = JSON.parse(ex.setDetails);
      }
    });
    return exercises;
  }

  /**
   * Delete exercise by ID
   */
  async deleteExercise(id: number): Promise<void> {
    await this.dbRun('DELETE FROM exercises WHERE id = ?', [id]);
  }

  /**
   * Delete all exercises for a workout
   */
  async deleteExercisesByWorkoutId(workoutId: number): Promise<void> {
    await this.dbRun('DELETE FROM exercises WHERE workoutId = ?', [workoutId]);
  }
}
