import { Request, Response, Express } from 'express';
import sqlite3 from 'sqlite3';
import { validateWorkout, validateExercise } from './validators';
import { setupAuthRoutes, verifyToken } from './auth';

import { RequestHandler } from 'express';

export function setupRoutes(app: Express, db: sqlite3.Database, loginLimiter: RequestHandler): void {
  // Setup auth routes
  setupAuthRoutes(app, db, loginLimiter);

  // ===== WORKOUT ENDPOINTS =====

  // GET /api/workouts - Get all workouts with their exercises
  app.get('/api/workouts', verifyToken, (req: Request, res: Response) => {
    try {
      db.all(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC',
        (err: Error | null, workouts: unknown[]) => {
          if (err) {
            res.status(500).json({ error: 'Database error', message: err.message });
            return;
          }

          // Fetch exercises for each workout
          const typedWorkouts = workouts as Array<{ id?: unknown; exercises?: Array<{ id: number }> }>;
          const workoutsWithExercises = typedWorkouts.map(workout => ({
            ...workout,
            exercises: [] as Array<{ id: number }>
          }));

          let completed = 0;
          typedWorkouts.forEach((workout, idx) => {
            db.all(
              'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
              [workout.id],
              (err: Error | null, exercises: unknown[]) => {
                if (!err) {
                  workoutsWithExercises[idx].exercises = exercises as Array<{ id: number }>;
                }
                completed++;
                if (completed === typedWorkouts.length) {
                  res.json(workoutsWithExercises);
                }
              }
            );
          });

          if (workouts.length === 0) {
            res.json([]);
          }
        }
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // POST /api/workouts - Create new workout session
  app.post('/api/workouts', verifyToken, (req: Request, res: Response) => {
    try {
      const { date, workoutName, startTime, notes } = req.body;

      validateWorkout({ date, workoutName });

      const stmt = db.prepare(
        'INSERT INTO workouts (date, workoutName, startTime, notes) VALUES (?, ?, ?, ?)'
      );

      stmt.run(date, workoutName, startTime || null, notes || null, function (this: { lastID: number }, err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }

        res.status(201).json({
          id: this.lastID,
          date,
          workoutName,
          startTime: startTime || null,
          notes: notes || null,
          exercises: []
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // GET /api/workouts/:id - Get single workout with exercises
  app.get('/api/workouts/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      db.get('SELECT * FROM workouts WHERE id = ?', [id], (err: Error | null, workout: unknown) => {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (!workout) {
          res.status(404).json({ error: 'Workout not found' });
          return;
        }

        db.all(
          'SELECT * FROM exercises WHERE workoutId = ? ORDER BY created_at ASC',
          [id],
          (err: Error | null, exercises: unknown[]) => {
            if (err) {
              res.status(500).json({ error: 'Database error', message: err.message });
              return;
            }
            res.json({ ...workout, exercises });
          }
        );
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // PUT /api/workouts/:id - Update workout (mainly for endTime/notes)
  app.put('/api/workouts/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { endTime, notes } = req.body;

      const stmt = db.prepare(
        'UPDATE workouts SET endTime = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );

      stmt.run(endTime || null, notes || null, id, function (this: { changes: number }, err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Workout not found' });
          return;
        }
        res.json({ id: parseInt(id), endTime: endTime || null, notes: notes || null });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // DELETE /api/workouts/:id - Delete workout (cascades to exercises)
  app.delete('/api/workouts/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const stmt = db.prepare('DELETE FROM workouts WHERE id = ?');
      stmt.run(id, function (this: { changes: number }, err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Workout not found' });
          return;
        }
        res.status(204).send();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // ===== EXERCISE ENDPOINTS =====

  // POST /api/exercises - Create exercise within a workout
  app.post('/api/exercises', verifyToken, (req: Request, res: Response) => {
    try {
      const { workoutId, name, sets, setDetails, notes } = req.body;

      validateExercise({ name, sets, setDetails, notes });

      const setDetailsJson = JSON.stringify(setDetails);

      const stmt = db.prepare(
        'INSERT INTO exercises (workoutId, name, sets, setDetails, notes) VALUES (?, ?, ?, ?, ?)'
      );

      stmt.run(workoutId, name, sets, setDetailsJson, notes || null, function (this: { lastID: number }, err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }

        res.status(201).json({
          id: this.lastID,
          workoutId,
          name,
          sets,
          setDetails,
          notes: notes || null
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // GET /api/exercises/:id - Get single exercise
  app.get('/api/exercises/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      db.get('SELECT * FROM exercises WHERE id = ?', [id], (err: Error | null, row: unknown) => {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (!row) {
          res.status(404).json({ error: 'Exercise not found' });
          return;
        }
        res.json(row);
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // DELETE /api/exercises/:id - Delete exercise
  app.delete('/api/exercises/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const stmt = db.prepare('DELETE FROM exercises WHERE id = ?');
      stmt.run(id, function (this: { changes: number }, err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Exercise not found' });
          return;
        }
        res.status(204).send();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // GET /api/backup/export - Export all workouts and exercises as JSON
  app.get('/api/backup/export', verifyToken, (req: Request, res: Response) => {
    try {
      db.all(
        'SELECT * FROM workouts ORDER BY date DESC',
        (err: Error | null, workouts: unknown[]) => {
          if (err) {
            res.status(500).json({ error: 'Database error', message: err.message });
            return;
          }

          const typedWorkouts = workouts as Array<{ id?: unknown; exercises?: Array<{ id: number }> }>;
          const workoutsWithExercises = typedWorkouts.map(workout => ({
            ...workout,
            exercises: [] as Array<{ id: number }>
          }));

          let completed = 0;
          if (typedWorkouts.length === 0) {
            const timestamp = new Date().toISOString().slice(0, 10);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="workout-backup-${timestamp}.json"`);
            res.json({
              exportDate: new Date().toISOString(),
              workoutCount: 0,
              exerciseCount: 0,
              workouts: []
            });
            return;
          }

          typedWorkouts.forEach((workout, idx) => {
            db.all(
              'SELECT * FROM exercises WHERE workoutId = ?',
              [workout.id],
              (err: Error | null, exercises: unknown[]) => {
                if (!err) {
                  workoutsWithExercises[idx].exercises = exercises as Array<{ id: number }>;
                }
                completed++;
                if (completed === typedWorkouts.length) {
                  const exerciseCount = workoutsWithExercises.reduce((sum, w) => sum + w.exercises.length, 0);
                  const timestamp = new Date().toISOString().slice(0, 10);
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Content-Disposition', `attachment; filename="workout-backup-${timestamp}.json"`);
                  res.json({
                    exportDate: new Date().toISOString(),
                    workoutCount: typedWorkouts.length,
                    exerciseCount,
                    workouts: workoutsWithExercises
                  });
                }
              }
            );
          });
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });
}

