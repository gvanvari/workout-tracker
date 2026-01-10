import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface Workout {
  id: number;
  date: string;
  workoutName: string;
  created_at: string;
  exercises?: Exercise[];
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

export class WorkoutDAO {
  private dbAll: (sql: string, params?: unknown[]) => Promise<unknown[]>;
  private dbGet: (sql: string, params?: unknown[]) => Promise<unknown>;
  private dbRun: (sql: string, params?: unknown[]) => Promise<{ lastID: number; changes: number }>;

  constructor(private db: sqlite3.Database) {
    this.dbAll = promisify(db.all.bind(db));
    this.dbGet = promisify(db.get.bind(db));
    this.dbRun = promisify(db.run.bind(db));
  }

  /**
   * Get all workouts ordered by date descending
   */
  async getAllWorkouts(): Promise<Workout[]> {
    const rows = await this.dbAll('SELECT * FROM workouts ORDER BY date DESC, created_at DESC');
    return (rows as Workout[]) || [];
  }

  /**
   * Get workout by ID
   */
  async getWorkoutById(id: number): Promise<Workout | undefined> {
    const row = await this.dbGet('SELECT * FROM workouts WHERE id = ?', [id]);
    return (row as Workout | undefined);
  }

  /**
   * Create a new workout
   */
  async createWorkout(date: string, workoutName: string): Promise<number> {
    const result = await this.dbRun(
      'INSERT INTO workouts (date, workoutName, created_at) VALUES (?, ?, ?)',
      [date, workoutName, new Date().toISOString()]
    );
    return result.lastID;
  }

  /**
   * Delete workout by ID
   */
  async deleteWorkout(id: number): Promise<void> {
    await this.dbRun('DELETE FROM workouts WHERE id = ?', [id]);
  }

  /**
   * Get all workouts with their exercises
   */
  async getAllWorkoutsWithExercises(): Promise<Workout[]> {
    const workouts = await this.getAllWorkouts();
    const typedWorkouts = workouts as Array<Workout & { exercises: Exercise[] }>;

    for (const workout of typedWorkouts) {
      workout.exercises = await this.getWorkoutExercises(workout.id);
    }

    return typedWorkouts;
  }

  /**
   * Get workout with exercises by ID
   */
  async getWorkoutWithExercises(id: number): Promise<Workout | undefined> {
    const workout = await this.getWorkoutById(id);
    if (!workout) return undefined;

    const typedWorkout = workout as Workout & { exercises: Exercise[] };
    typedWorkout.exercises = await this.getWorkoutExercises(id);

    return typedWorkout;
  }

  /**
   * Get all exercises for a specific workout
   */
  private async getWorkoutExercises(workoutId: number): Promise<Exercise[]> {
    const rows = await this.dbAll(
      'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
      [workoutId]
    );
    const exercises = (rows as Exercise[]) || [];
    // Parse setDetails JSON strings
    exercises.forEach((ex) => {
      if (typeof ex.setDetails === 'string') {
        ex.setDetails = JSON.parse(ex.setDetails);
      }
    });
    return exercises;
  }
}
