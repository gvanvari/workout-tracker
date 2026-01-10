import sqlite3 from 'sqlite3';

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
  constructor(private db: sqlite3.Database) {}

  /**
   * Get all workouts ordered by date descending
   */
  getAllWorkouts(): Promise<Workout[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC',
        (err: Error | null, rows: unknown[]) => {
          if (err) reject(err);
          else resolve((rows as Workout[]) || []);
        }
      );
    });
  }

  /**
   * Get workout by ID
   */
  getWorkoutById(id: number): Promise<Workout | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM workouts WHERE id = ?',
        [id],
        (err: Error | null, row: unknown) => {
          if (err) reject(err);
          else resolve((row as Workout | undefined));
        }
      );
    });
  }

  /**
   * Create a new workout
   */
  createWorkout(date: string, workoutName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO workouts (date, workoutName, created_at) VALUES (?, ?, ?)',
        [date, workoutName, new Date().toISOString()],
        function (this: { lastID: number }, err: Error | null) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Delete workout by ID
   */
  deleteWorkout(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM workouts WHERE id = ?',
        [id],
        function (this: { changes: number }, err: Error | null) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
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
  private getWorkoutExercises(workoutId: number): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
        [workoutId],
        (err: Error | null, rows: unknown[]) => {
          if (err) reject(err);
          else {
            const exercises = (rows as Exercise[]) || [];
            // Parse setDetails JSON strings
            exercises.forEach((ex) => {
              if (typeof ex.setDetails === 'string') {
                ex.setDetails = JSON.parse(ex.setDetails);
              }
            });
            resolve(exercises);
          }
        }
      );
    });
  }
}
