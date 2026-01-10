import sqlite3 from 'sqlite3';

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
  constructor(private db: sqlite3.Database) {}

  /**
   * Create a new exercise for a workout
   */
  createExercise(workoutId: number, exercise: ExerciseInput): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO exercises (workoutId, name, sets, setDetails, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          workoutId,
          exercise.name,
          exercise.sets,
          JSON.stringify(exercise.setDetails),
          exercise.notes || null,
          new Date().toISOString()
        ],
        function (this: { lastID: number }, err: Error | null) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Get exercise by ID
   */
  getExerciseById(id: number): Promise<Exercise | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM exercises WHERE id = ?',
        [id],
        (err: Error | null, row: unknown) => {
          if (err) {
            reject(err);
          } else {
            const exercise = row as Exercise | undefined;
            if (exercise && typeof exercise.setDetails === 'string') {
              exercise.setDetails = JSON.parse(exercise.setDetails);
            }
            resolve(exercise);
          }
        }
      );
    });
  }

  /**
   * Get all exercises for a specific workout
   */
  getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
        [workoutId],
        (err: Error | null, rows: unknown[]) => {
          if (err) {
            reject(err);
          } else {
            const exercises = (rows as Exercise[]) || [];
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

  /**
   * Delete exercise by ID
   */
  deleteExercise(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM exercises WHERE id = ?',
        [id],
        function (this: { changes: number }, err: Error | null) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Delete all exercises for a workout
   */
  deleteExercisesByWorkoutId(workoutId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM exercises WHERE workoutId = ?',
        [workoutId],
        function (this: { changes: number }, err: Error | null) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}
