# Workout Tracker MVP - Complete Specification

---

## 1. Project Structure

```
workout-tracker-v2/
├── frontend/
│   ├── src/
│   │   ├── main.ts              (entry point)
│   │   ├── styles.css           (all styling)
│   │   └── api.ts               (fetch calls)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── index.ts             (Express server)
│   │   ├── database.ts          (SQLite setup)
│   │   ├── auth.ts              (login logic)
│   │   ├── routes.ts            (API endpoints)
│   │   └── validators.ts        (input validation)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                     (ignored by git)
│   └── .env.example             (template)
│
├── README.md
└── .gitignore
```

---

## 2. Database Schema

### SQLite Table: `exercises`

```sql
CREATE TABLE exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,                    -- Format: YYYY-MM-DD
  name TEXT NOT NULL,                    -- e.g., "Squat", "Bench Press"
  sets INTEGER NOT NULL,                 -- Number of sets
  reps TEXT NOT NULL,                    -- Comma-separated: "8,8,6"
  weight REAL NOT NULL,                  -- In lbs
  rpe INTEGER NOT NULL,                  -- 1-10 (Rate of Perceived Exertion)
  notes TEXT,                            -- Optional notes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_exercises_date ON exercises(date);
CREATE INDEX idx_exercises_name ON exercises(name);
```

---

## 3. REST API Endpoints

### Authentication

```
POST /api/auth/login
  Request:  { "password": "string" }
  Response: { "token": "jwt-token", "success": true }
  Status:   200 (success) or 401 (invalid)
```

### Exercises

```
GET /api/exercises
  Query:    ?name=squat&startDate=2025-01-01&endDate=2025-01-31
  Response: [{ id, date, name, sets, reps, weight, rpe, notes }, ...]
  Status:   200

POST /api/exercises
  Request:  { date, name, sets, reps, weight, rpe, notes }
  Response: { id, date, name, ... }
  Status:   201 (created) or 400 (validation error)

GET /api/exercises/:id
  Response: { id, date, name, ... }
  Status:   200 or 404

PUT /api/exercises/:id
  Request:  { date, name, sets, reps, weight, rpe, notes }
  Response: { id, ... }
  Status:   200 or 404

DELETE /api/exercises/:id
  Status:   204 (no content) or 404
```

### Backup/Export

```
GET /api/backup/export
  Response: JSON file download (all exercises)
  Status:   200
```

---

## 4. Frontend Components & Pages

### Page 1: Login

```
┌─────────────────────────┐
│    Workout Tracker      │
├─────────────────────────┤
│                         │
│  Password: [_______]    │
│  [Login Button]         │
│                         │
│  (No signup needed)     │
└─────────────────────────┘
```

### Page 2: Dashboard (After Login)

```
┌──────────────────────────────────────┐
│      Workout Tracker                 │
├──────────────────────────────────────┤
│  [Add Exercise] [History] [Export]   │
├──────────────────────────────────────┤
│                                      │
│  Quick Stats:                        │
│  Last workout: Jan 15 - Squat        │
│  Exercises logged: 42                │
│  [Logout]                            │
│                                      │
└──────────────────────────────────────┘
```

### Page 3: Add Exercise

```
┌──────────────────────────────────────┐
│      Add New Exercise                │
├──────────────────────────────────────┤
│                                      │
│  Date:        [2025-01-20]           │
│  Exercise:    [Squat    ▼]           │
│  Sets:        [3        ]            │
│  Reps:        [8,8,6    ]            │
│  Weight (lbs):[225      ]            │
│  RPE (1-10):  [8        ]            │
│  Notes:       [Optional ]            │
│                                      │
│  [Save Exercise] [Cancel]            │
│                                      │
└──────────────────────────────────────┘
```

### Page 4: History

```
┌──────────────────────────────────────┐
│      Exercise History                │
├──────────────────────────────────────┤
│  Filter: [Exercise ▼] [Date Range]   │
├──────────────────────────────────────┤
│                                      │
│  Date  | Exercise | Sets | Reps |W  │
│  Jan20 | Squat    | 3    | 8,8,6|225│
│  Jan18 | Bench    | 4    | 5,5,5|185│
│  Jan15 | Squat    | 3    | 8,8,8|225│
│                                      │
└──────────────────────────────────────┘
```

---

## 5. Security Implementation Checklist

### A. Input Validation

```typescript
// validators.ts
export function validateExercise(data: any) {
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
    throw new Error("Invalid date format (YYYY-MM-DD)");

  if (!data.name || typeof data.name !== "string" || data.name.length > 50)
    throw new Error("Invalid exercise name");

  if (!Number.isInteger(data.sets) || data.sets < 1 || data.sets > 20)
    throw new Error("Sets must be 1-20");

  if (!data.weight || data.weight < 0 || data.weight > 1000)
    throw new Error("Invalid weight");

  if (!Number.isInteger(data.rpe) || data.rpe < 1 || data.rpe > 10)
    throw new Error("RPE must be 1-10");
}
```

### B. SQL Injection Prevention

```typescript
// Use parameterized queries ALWAYS
const stmt = db.prepare(
  "INSERT INTO exercises (date, name, weight) VALUES (?, ?, ?)"
);
stmt.run(date, name, weight); // ✅ SAFE

// NEVER do this:
// db.exec(`INSERT INTO exercises VALUES ('${date}', '${name}')`); ❌ VULNERABLE
```

### C. Password Security

```typescript
// auth.ts
import bcrypt from "bcrypt";

// On server startup (or manually create once)
const HASHED_PASSWORD = bcrypt.hashSync("yourPassword", 10);

// On login
app.post("/api/auth/login", rateLimiter, (req, res) => {
  if (bcrypt.compareSync(req.body.password, HASHED_PASSWORD)) {
    const token = jwt.sign({ auth: true }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});
```

### D. Rate Limiting

```typescript
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/api/auth/login', loginLimiter, ...);
```

### E. Security Headers

```typescript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000"); // For HTTPS later
  next();
});
```

### F. CORS Configuration

```typescript
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

### G. Environment Variables

```
// .env (not in git)
PORT=4000
DB_PATH=./data.db
JWT_SECRET=your-super-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

// .env.example (in git for reference)
PORT=4000
DB_PATH=./data.db
JWT_SECRET=change-this-to-random-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## 6. Backend Dependencies

```json
{
  "dependencies": {
    "express": "latest",
    "sqlite3": "latest",
    "bcrypt": "latest",
    "jsonwebtoken": "latest",
    "cors": "latest",
    "express-rate-limit": "latest",
    "dotenv": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/express": "latest",
    "@types/node": "latest",
    "ts-node": "latest"
  }
}
```

---

## 7. Frontend Dependencies

```json
{
  "dependencies": {},
  "devDependencies": {
    "typescript": "latest",
    "vite": "latest"
  }
}
```

**Note:** No frameworks! Pure TypeScript + HTML.

---

## 8. Step-by-Step Build Plan (3-4 hours)

### Phase 1: Setup (0-30 min)

- [ ] Create project folders
- [ ] Initialize npm projects (backend + frontend)
- [ ] Setup TypeScript configs
- [ ] Setup Vite config
- [ ] Create .env files
- [ ] Install dependencies

### Phase 2: Backend Foundation (0.5-1.5 hours)

- [ ] Create Express server
- [ ] Setup SQLite database + schema
- [ ] Create validators.ts
- [ ] Implement /api/auth/login endpoint
- [ ] Add bcrypt password hashing
- [ ] Add rate limiting

### Phase 3: Core Endpoints (1.5-2.5 hours)

- [ ] GET /api/exercises (list with filters)
- [ ] POST /api/exercises (create with validation)
- [ ] GET /api/exercises/:id (single)
- [ ] PUT /api/exercises/:id (update)
- [ ] DELETE /api/exercises/:id (delete)
- [ ] GET /api/backup/export (JSON download)

### Phase 4: Frontend (2.5-3.5 hours)

- [ ] HTML structure (login + dashboard + forms)
- [ ] CSS styling (functional, minimal)
- [ ] Login page functionality
- [ ] Add exercise form
- [ ] Display history table
- [ ] Export button

### Phase 5: Polish & Testing (3.5-4 hours)

- [ ] Test all endpoints with curl/Postman
- [ ] Test frontend flows
- [ ] Error handling & user feedback
- [ ] README documentation
- [ ] GitHub push

---

## 9. Tech Stack Summary

| Layer          | Tech                           | Why                           |
| -------------- | ------------------------------ | ----------------------------- |
| Frontend       | TypeScript + HTML              | Simple, no framework overhead |
| Frontend Build | Vite                           | Fast, zero-config             |
| Backend        | Node.js + Express              | Lightweight, proven           |
| Database       | SQLite                         | File-based, no server needed  |
| Auth           | JWT + bcrypt                   | Stateless, secure passwords   |
| Security       | bcrypt, rate limit, validators | OWASP compliance              |

---

## 10. Success Criteria

✅ **MVP Complete When:**

- [ ] Can login with password
- [ ] Can add exercises to SQLite
- [ ] Can view history (table format)
- [ ] Can filter by exercise name & date
- [ ] Can export all data to JSON
- [ ] All SQL queries are parameterized
- [ ] Input validation on all forms
- [ ] Rate limiting on login
- [ ] Security headers set
- [ ] README documents everything
- [ ] Code is on GitHub
- [ ] Runs with `npm install && npm run dev` (both frontend + backend)

---

## 11. Deployment Readiness (Future)

Once MVP works locally:

- [ ] Switch HTTP → HTTPS (add SSL)
- [ ] Deploy backend (Render, Railway, Fly.io)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Add database backups (automated)
- [ ] Add Python AI service (optional)
