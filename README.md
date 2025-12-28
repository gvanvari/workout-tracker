# Workout Tracker - MVP

A lightweight, local-first workout tracking application built with vanilla TypeScript and Node.js. Track exercises, sets, reps, weights, and RPE ratings with a secure, self-hosted backend.

---

## ✨ Features

- **Simple Login** - Password-protected access
- **Add Exercises** - Track date, exercise name, sets, reps, weight, RPE
- **View History** - Filter by exercise name and date range
- **Export Data** - Manual JSON backup
- **Secure** - Input validation, parameterized SQL, bcrypt password hashing, rate limiting
- **Local First** - All data stored in SQLite (no cloud required)
- **REST API** - Clean, documented endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | TypeScript + HTML + CSS + Vite |
| **Backend** | Node.js + Express |
| **Database** | SQLite (file-based) |
| **Security** | bcrypt, JWT, rate limiting, input validation |

---

## 📋 Prerequisites

Before starting, ensure you have:
- **macOS 13+** (Intel or Apple Silicon)
- **Homebrew** installed
- **Terminal/iTerm2** for commands
- **VS Code** (recommended)
- **~20 minutes** for initial setup

For detailed tool installation, see [tool-setup.md](tool-setup.md).

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Tools (One-time)

```bash
# Install Node.js (includes npm)
brew install node

# Install SQLite
brew install sqlite3

# Install Git
brew install git

# Verify installation
node --version    # Should show v18+
npm --version     # Should show 9+
sqlite3 --version # Should show version
```

### Step 2: Install Dependencies

```bash
# Backend
cd /Users/gvanvari/code/workout-tracker/backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### Step 3: Start Servers

**Terminal 1 - Backend**
```bash
cd /Users/gvanvari/code/workout-tracker/backend
npm run dev
# Output: "Server running on port 4000"
```

**Terminal 2 - Frontend**
```bash
cd /Users/gvanvari/code/workout-tracker/frontend
npm run dev
# Output: "Local: http://localhost:5173"
```

### Step 4: Access App

Open **http://localhost:5173** in browser  
**Login password**: `yourPassword`

---

## 📁 Project Structure

```
workout-tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts         # Express server
│   │   ├── database.ts      # SQLite setup
│   │   ├── auth.ts          # Login logic
│   │   ├── routes.ts        # API endpoints
│   │   └── validators.ts    # Input validation
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── main.ts          # App logic
│   │   ├── api.ts           # API calls
│   │   ├── styles.css       # Styling
│   │   └── index.html       # HTML
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── mvp-spec.md              # Technical spec
├── tool-setup.md            # Tool installation
└── README.md                # This file
```

---

## 🔧 Development Commands

**Backend:**
```bash
cd backend
npm run dev     # Start with auto-reload
npm run build   # Compile TypeScript
npm start       # Run production
```

**Frontend:**
```bash
cd frontend
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview build
```

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login
  Request: { "password": "string" }
  Response: { "token": "jwt-token", "success": true }
```

### Exercises
```
GET    /api/exercises                    # List (filters: ?name=, ?startDate=, ?endDate=)
POST   /api/exercises                    # Create
GET    /api/exercises/:id                # Get one
PUT    /api/exercises/:id                # Update
DELETE /api/exercises/:id                # Delete
GET    /api/backup/export                # Export JSON
```

### Request Body Example (POST /api/exercises)
```json
{
  "date": "2025-01-20",
  "name": "Squat",
  "sets": 3,
  "reps": "8,8,6",
  "weight": 225,
  "rpe": 8,
  "notes": "Felt good"
}
```

---

## 🗄️ Database

SQLite database auto-created at `backend/data.db`

**exercises table:**
```
id INTEGER PRIMARY KEY
date TEXT (YYYY-MM-DD)
name TEXT
sets INTEGER (1-20)
reps TEXT (comma-separated: "8,8,6")
weight REAL (lbs)
rpe INTEGER (1-10)
notes TEXT
created_at DATETIME
updated_at DATETIME
```

**View data:**
```bash
sqlite3 backend/data.db
> SELECT * FROM exercises;
> .exit
```

---

## 🔒 Security

- ✅ **Password Hashing** - bcrypt (10 rounds)
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Input Validation** - All forms validated
- ✅ **Rate Limiting** - 5 login attempts per 15 min
- ✅ **CORS** - Restricted to localhost
- ✅ **JWT** - 7-day token expiration
- ✅ **Security Headers** - X-Content-Type-Options, X-Frame-Options, etc.

See [mvp-spec.md](mvp-spec.md#5-security-implementation-checklist) for details.

---

## 🧪 Test Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"yourPassword"}'

# Add exercise
curl -X POST http://localhost:4000/api/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "date":"2025-01-20",
    "name":"Squat",
    "sets":3,
    "reps":"8,8,6",
    "weight":225,
    "rpe":8
  }'

# Get all exercises
curl http://localhost:4000/api/exercises

# Filter by name
curl "http://localhost:4000/api/exercises?name=squat"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method & URL
4. Add headers/body
5. Send

---

## 🚨 Troubleshooting

### "Port 4000 already in use"
```bash
lsof -i :4000       # Find process
kill -9 <PID>       # Kill it
# Or change PORT in backend/.env
```

### "npm: command not found"
```bash
brew uninstall node && brew install node
node --version
```

### "sqlite3: command not found"
```bash
brew install sqlite3
sqlite3 --version
```

### Frontend won't load
```bash
# Start backend first!
cd backend && npm run dev
# Then in new terminal:
cd frontend && npm run dev
```

### Database locked
```bash
# Restart backend
cd backend && npm run dev
```

---

## 📚 Full Documentation

- **[mvp-spec.md](mvp-spec.md)** - Technical specification & architecture
- **[tool-setup.md](tool-setup.md)** - Detailed tool installation guide

---

## 📈 Future Features

- [ ] AI workout recommendations (Python + OpenAI)
- [ ] Progress charts
- [ ] CSV export
- [ ] Edit exercises from UI
- [ ] Cloud backup
- [ ] Mobile app

---

## 🎯 Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Backend running on `http://localhost:4000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can login (password: `yourPassword`)
- [ ] Can add & view exercises
- [ ] Can export data
- [ ] Database created at `backend/data.db`