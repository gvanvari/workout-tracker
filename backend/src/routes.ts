import { Request, Response, Express, RequestHandler } from 'express';
import sqlite3 from 'sqlite3';
import { validateWorkout, validateExercise } from './validators';
import { setupAuthRoutes, verifyToken } from './auth';
import { WorkoutDAO } from './dao/workoutDAO';
import { ExerciseDAO } from './dao/exerciseDAO';

export function setupRoutes(app: Express, db: sqlite3.Database, loginLimiter: RequestHandler): void {
  // Setup auth routes
  setupAuthRoutes(app, db, loginLimiter);

  // Initialize DAOs
  const workoutDAO = new WorkoutDAO(db);
  const exerciseDAO = new ExerciseDAO(db);

  // ===== WORKOUT ENDPOINTS =====

  // GET /api/workouts - Get all workouts with their exercises
  app.get('/api/workouts', verifyToken, async (req: Request, res: Response) => {
    try {
      const workoutsWithExercises = await workoutDAO.getAllWorkoutsWithExercises();
      res.json(workoutsWithExercises);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });

  // POST /api/workouts - Create new workout session
  app.post('/api/workouts', verifyToken, async (req: Request, res: Response) => {
    try {
      const { date, workoutName } = req.body;

      validateWorkout({ date, workoutName });

      const id = await workoutDAO.createWorkout(date, workoutName);

      res.status(201).json({
        id,
        date,
        workoutName,
        exercises: []
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // GET /api/workouts/:id - Get single workout with exercises
  app.get('/api/workouts/:id', verifyToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const workout = await workoutDAO.getWorkoutWithExercises(parseInt(id));

      if (!workout) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }

      res.json(workout);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });

  // DELETE /api/workouts/:id - Delete workout (cascades to exercises)
  app.delete('/api/workouts/:id', verifyToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Delete associated exercises first
      await exerciseDAO.deleteExercisesByWorkoutId(parseInt(id));

      // Then delete the workout
      await workoutDAO.deleteWorkout(parseInt(id));

      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });

  // ===== EXERCISE ENDPOINTS =====

  // POST /api/exercises - Create exercise within a workout
  app.post('/api/exercises', verifyToken, async (req: Request, res: Response) => {
    try {
      const { workoutId, name, sets, setDetails, notes } = req.body;

      validateExercise({ name, sets, setDetails, notes });

      const id = await exerciseDAO.createExercise(workoutId, {
        name,
        sets,
        setDetails,
        notes
      });

      res.status(201).json({
        id,
        workoutId,
        name,
        sets,
        setDetails,
        notes: notes || null
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // GET /api/exercises/:id - Get single exercise
  app.get('/api/exercises/:id', verifyToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const exercise = await exerciseDAO.getExerciseById(parseInt(id));

      if (!exercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
      }

      res.json(exercise);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });

  // DELETE /api/exercises/:id - Delete exercise
  app.delete('/api/exercises/:id', verifyToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await exerciseDAO.deleteExercise(parseInt(id));

      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });

  // GET /api/backup/export - Export all workouts and exercises as JSON
  app.get('/api/backup/export', verifyToken, async (req: Request, res: Response) => {
    try {
      const workoutsWithExercises = await workoutDAO.getAllWorkoutsWithExercises();

      const exerciseCount = workoutsWithExercises.reduce(
        (sum, w) => sum + (w.exercises?.length || 0),
        0
      );

      const timestamp = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="workout-backup-${timestamp}.json"`);

      res.json({
        exportDate: new Date().toISOString(),
        workoutCount: workoutsWithExercises.length,
        exerciseCount,
        workouts: workoutsWithExercises
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', message });
    }
  });
}


