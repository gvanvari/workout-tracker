import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { validatePassword } from './validators';

// Hash the default password once (in production, use environment variable)
const DEFAULT_PASSWORD = 'yourPassword';
const HASHED_PASSWORD = bcryptjs.hashSync(DEFAULT_PASSWORD, 10);

export function setupAuthRoutes(app: any, db: sqlite3.Database, loginLimiter: any): void {
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
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
}

// Middleware to verify JWT token
export function verifyToken(req: Request, res: Response, next: any): void {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
