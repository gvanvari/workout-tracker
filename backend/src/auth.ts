import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, Express, RequestHandler } from 'express';
import sqlite3 from 'sqlite3';
import { validatePassword } from './validators';

// Hash the default password once (in production, use environment variable)
const DEFAULT_PASSWORD = 'yourPassword';
const HASHED_PASSWORD = bcryptjs.hashSync(DEFAULT_PASSWORD, 10);

export function setupAuthRoutes(app: Express, db: sqlite3.Database, loginLimiter: RequestHandler): void {
  app.post('/api/auth/login', loginLimiter, (req: Request, res: Response) => {
    try {
      const { password } = req.body;

      validatePassword(password);

      // Compare password with hashed password
      if (bcryptjs.compareSync(password, HASHED_PASSWORD)) {
        const token = jwt.sign(
          { auth: true },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        res.json({ token, success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
      } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
}

// Middleware to verify JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
