# 💪 Workout Tracker MVP

A locally-hosted, full-stack workout tracking application demonstrating modern web development practices and architecture patterns.

## 🎯 Technical Highlights

### Architecture & Design Patterns

- **Session-Based Data Model** - Workouts contain multiple exercises (proper parent-child hierarchy with FK relationships)
- **REST API** - Clean separation of concerns with dedicated backend routes and middleware
- **JWT Authentication** - Stateless authentication with token expiration (7-day lifecycle)
- **Fuzzy Matching** - Smart exercise name normalization using Levenshtein distance (>85% similarity threshold) to prevent duplicates from typos

### Frontend Implementation

- **Vanilla TypeScript** - No frameworks; pure DOM manipulation for educational clarity
- **Multi-Page SPA** - Client-side routing with state management (Dashboard, Add Exercise, History, Progress)
- **Real-Time Suggestions** - Autocomplete with predefined exercise library + fuzzy matching against past exercises
- **Data Visualization** - Exercise progress tracking across multiple workouts with aggregate statistics

### Backend & Database

- **Node.js + Express** - Modular route handlers, middleware pipeline, error handling
- **SQLite with Relational Schema** - Proper foreign keys, cascade deletes, indexed queries
- **Input Validation** - Dual-layer validation (backend + frontend) with type-safe schemas
- **Security** - bcrypt password hashing, rate limiting, parameterized SQL queries, CORS protection

### Advanced Features

- **Per-Set Tracking** - JSON storage of weight, reps, RPE for each set with full history
- **Normalized Exercise Names** - Automatic grouping of similar exercise names using fuzzy matching
- **Hierarchical Data Export** - Complete JSON backup with nested workout-exercise structure
- **Progress Analytics** - Aggregate max weights, count statistics across multiple workout sessions

## 📚 Tech Stack

| Layer        | Technologies                                   |
| ------------ | ---------------------------------------------- |
| **Frontend** | TypeScript, HTML, CSS, Vite                    |
| **Backend**  | Node.js, Express, TypeScript                   |
| **Database** | SQLite3 with relational schema                 |
| **Security** | bcryptjs, JWT, rate-limiting, input validation |
| **Build**    | TypeScript compiler, Vite bundler              |

## 🚀 Getting Started

See [QUICKSTART.md](QUICKSTART.md) for a 30-second setup.  
See [SETUP.md](SETUP.md) for detailed installation instructions.  
See [tool-setup.md](tool-setup.md) for environment setup.

## ✨ Core Features

✅ **Secure JWT Authentication** - Stateless login with bcrypt password hashing  
✅ **Workout Sessions** - Group exercises by date and type (Core, HIIT, Push, Pull, Legs, etc.)  
✅ **Exercise Tracking** - Log sets with weight, reps, RPE ratings per set  
✅ **Fuzzy Name Matching** - Levenshtein distance prevents duplicates from typos  
✅ **Progress Analytics** - Track exercise improvements across multiple workouts  
✅ **Detailed History** - Complete per-set information for all past workouts  
✅ **Data Export** - JSON backup of complete hierarchical workout structure  
✅ **Input Validation** - Client & server-side validation for data integrity

## 🔧 Key Implementation Details

### Exercise Name Normalization

- Levenshtein distance algorithm for fuzzy matching
- > 85% similarity threshold for automatic grouping
- Displays longest/most complete name when matching variations
- Prevents user frustration from typos fragmenting exercise data

### Progress Tracking System

- Aggregate exercise statistics across multiple workout sessions
- Shows maximum weight lifted per exercise
- Displays complete chronological set history with progression
- Searches work with fuzzy matching (e.g., "chest pres" matches "chest press")

### Database Schema

```
workouts
  ├─ id, date, workoutName
  ├─ startTime, endTime, notes
  └─ exercises (FK workoutId)
       ├─ id, name, sets
       ├─ setDetails (JSON: [{weight, reps, rpe}, ...])
       └─ notes

Indexes: date, workoutId for fast queries
Cascade delete for referential integrity
```

## 📁 Project Structure

```
├── frontend/                 # Vite + TypeScript SPA
│   ├── src/main.ts          # 900+ lines: routing, rendering, state
│   ├── src/api.ts           # API client with auth
│   └── src/styles.css       # Component styling
│
├── backend/                  # Express + Node.js
│   ├── src/index.ts         # Server, middleware setup
│   ├── src/routes.ts        # 280+ lines: 10 REST endpoints
│   ├── src/database.ts      # SQLite schema & init
│   ├── src/validators.ts    # Input validation logic
│   └── src/auth.ts          # JWT & password utilities
│
└── docs/
    ├── README.md            # This file (technical overview)
    ├── QUICKSTART.md        # 30-second setup
    ├── SETUP.md             # Detailed installation
    └── tool-setup.md        # Environment setup
```

## 🎓 Software Engineering Concepts Demonstrated

- **Separation of Concerns** - Frontend/backend/database layers
- **Relational Database Design** - Foreign keys, normalization, cascade deletes
- **RESTful API Design** - Standard HTTP methods, resource-oriented endpoints
- **Authentication & Authorization** - JWT tokens, password hashing, rate limiting
- **Input Validation** - Preventing injection attacks, type safety
- **Error Handling** - Try-catch, validation errors, user feedback
- **State Management** - Client-side routing and data synchronization
- **Fuzzy Matching** - String similarity algorithms for user-friendly features
- **Security Best Practices** - Parameterized queries, CORS, secure headers

## 📊 API Summary

**10 REST Endpoints:**

- Auth: POST /api/auth/login
- Workouts: GET/POST/PUT/DELETE /api/workouts
- Exercises: POST/DELETE /api/exercises (requires workoutId)
- Backup: GET /api/backup/export

**Database:** SQLite with workouts + exercises tables (relational design)

**Authentication:** JWT with 7-day expiration + rate limiting (5 attempts/15min)

---

**Note:** This is a complete MVP built for local use by a single user. It prioritizes educational value, clean architecture, and feature completeness over scalability.
