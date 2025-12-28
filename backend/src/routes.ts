import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { validateExercise } from './validators';
import { setupAuthRoutes, verifyToken } from './auth';

export function setupRoutes(app: any, db: sqlite3.Database, loginLimiter: any): void {
  // Setup auth routes
  setupAuthRoutes(app, db, loginLimiter);

  // GET /api/exercises - Get all exercises with optional filters
  app.get('/api/exercises', verifyToken, (req: Request, res: Response) => {
    try {
      const { name, startDate, endDate } = req.query;

      let query = 'SELECT * FROM exercises';
      const params: any[] = [];

      if (name) {
        query += ' WHERE name LIKE ?';
        params.push(`%${name}%`);
      }

      if (startDate && endDate) {
        if (name) {
          query += ' AND date BETWEEN ? AND ?';
        } else {
          query += ' WHERE date BETWEEN ? AND ?';
        }
        params.push(startDate, endDate);
      }

      query += ' ORDER BY date DESC';

      db.all(query, params, (err: Error | null, rows: any[]) => {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        res.json(rows);
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // POST /api/exercises - Create new exercise
  app.post('/api/exercises', verifyToken, (req: Request, res: Response) => {
    try {
      const { date, name, sets, reps, weight, rpe, notes } = req.body;

      validateExercise({ date, name, sets, reps, weight, rpe, notes });

      const stmt = db.prepare(
        'INSERT INTO exercises (date, name, sets, reps, weight, rpe, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );

      stmt.run(date, name, sets, reps, weight, rpe, notes || null, function (err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        res.status(201).json({
          id: this.lastID,
          date,
          name,
          sets,
          reps,
          weight,
          rpe,
          notes: notes || null
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/exercises/:id - Get single exercise
  app.get('/api/exercises/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      db.get('SELECT * FROM exercises WHERE id = ?', [id], (err: Error | null, row: any) => {
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /api/exercises/:id - Update exercise
  app.put('/api/exercises/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { date, name, sets, reps, weight, rpe, notes } = req.body;

      validateExercise({ date, name, sets, reps, weight, rpe, notes });

      const stmt = db.prepare(
        'UPDATE exercises SET date = ?, name = ?, sets = ?, reps = ?, weight = ?, rpe = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );

      stmt.run(date, name, sets, reps, weight, rpe, notes || null, id, function (err: Error | null) {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Exercise not found' });
          return;
        }
        res.json({ id: parseInt(id), date, name, sets, reps, weight, rpe, notes: notes || null });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/exercises/:id - Delete exercise
  app.delete('/api/exercises/:id', verifyToken, (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const stmt = db.prepare('DELETE FROM exercises WHERE id = ?');
      stmt.run(id, function (err: Error | null) {
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // GET /api/backup/export - Export all exercises as JSON
  app.get('/api/backup/export', verifyToken, (req: Request, res: Response) => {
    try {
      db.all('SELECT * FROM exercises ORDER BY date DESC', (err: Error | null, rows: any[]) => {
        if (err) {
          res.status(500).json({ error: 'Database error', message: err.message });
          return;
        }
        
        const timestamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="workout-backup-${timestamp}.json"`);
        res.json({
          exportDate: new Date().toISOString(),
          exerciseCount: rows.length,
          exercises: rows
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}
