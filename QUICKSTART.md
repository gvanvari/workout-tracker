# 🏋️ Workout Tracker - Quick Start

## 30-Second Setup

```bash
cd /Users/gvanvari/code/workout-tracker
./setup.sh
npm run dev
```

Then open http://localhost:5173 in your browser and login with `yourPassword`

---

## What Just Happened?

You now have a fully-functional workout tracking app with:

✅ **Backend API** running on http://localhost:4000
- 6 REST endpoints for exercise management
- SQLite database for local storage
- Secure JWT authentication
- Rate limiting and input validation

✅ **Frontend UI** running on http://localhost:5173
- Login page with password authentication
- Dashboard with statistics
- Exercise add form with full validation
- Workout history with filtering
- One-click data export

✅ **Local Database**
- SQLite (zero config, file-based)
- Auto-creates on first run
- All data stored locally on your machine

---

## Using the App

### Login
- Password: `yourPassword` (change in production!)

### Add a Workout
1. Click "Add Exercise"
2. Fill in: date, name, sets, reps, weight, RPE, notes
3. Click "Save Exercise"
4. See it appear in Dashboard and History

### View History
- Click "History" to see all workouts
- Filter by exercise name
- Delete old entries if needed

### Export Data
- Click "Export Data" to download your workouts as JSON
- Useful for backup or importing elsewhere

---

## Project Structure

```
workout-tracker/
├── backend/              # Express.js API
│   └── src/              # TypeScript source
│       ├── index.ts      # Server entry point
│       ├── database.ts   # SQLite schema & init
│       ├── auth.ts       # JWT + password auth
│       ├── validators.ts # Input validation
│       └── routes.ts     # API endpoints
│
├── frontend/             # Vite + TypeScript UI
│   └── src/              # Source code
│       ├── main.ts       # App logic & rendering
│       ├── api.ts        # API client wrapper
│       └── styles.css    # All styling
│
└── Config Files
    ├── README.md         # Full documentation
    ├── SETUP.md          # Detailed setup guide
    ├── package.json      # Root scripts
    └── .gitignore        # Git ignore rules
```

---

## Available Commands

```bash
# Development - run both servers
npm run dev

# Build for production
npm run build

# Start only backend
npm -C backend run dev

# Start only frontend
npm -C frontend run dev

# Backend TypeScript compilation only
npm -C backend run build
```

---

## Database

Database file: `backend/workout.db` (SQLite)

**Exercises Table:**
- `id` - Unique identifier
- `date` - YYYY-MM-DD format
- `name` - Exercise name (required)
- `sets` - Number of sets (1-20)
- `reps` - Comma-separated values
- `weight` - In pounds
- `rpe` - Rate of Perceived Exertion (1-10)
- `notes` - Optional notes
- `created_at` / `updated_at` - Timestamps

To reset database:
```bash
rm backend/workout.db
# Restart backend - it recreates empty DB
```

---

## Troubleshooting

### "Address already in use"
Kill the process and restart:
```bash
lsof -i :4000      # Find process on port 4000
kill -9 <PID>      # Kill it
npm run dev        # Start again
```

### Module not found errors
Re-install dependencies:
```bash
rm -rf backend/node_modules frontend/node_modules
./setup.sh
```

### Login fails
- Verify backend is running on port 4000
- Check `backend/.env` for JWT_SECRET
- Default password is: `yourPassword`

### TypeScript errors on startup
These disappear after `npm install` completes. They're normal development-time errors before dependencies are installed.

---

## Security Notes

⚠️ **Current Setup** is suitable for personal use only!

For production deployment, you must:
1. Change `JWT_SECRET` in `backend/.env` to a random 32+ character string
2. Change the default password in `backend/src/auth.ts`
3. Enable HTTPS/SSL
4. Set `NODE_ENV=production`
5. Configure database backups
6. Review and implement additional OWASP controls

---

## API Reference

All endpoints require JWT token (except login)

```
POST /api/auth/login
  Body: { password: "yourPassword" }
  Returns: { token: "jwt-token-here", success: true }

GET /api/exercises
  Headers: Authorization: Bearer <token>
  Query: ?name=Squat&startDate=2025-01-01&endDate=2025-12-31
  Returns: [{ id, date, name, sets, reps, weight, rpe, notes, ... }]

POST /api/exercises
  Headers: Authorization: Bearer <token>
  Body: { date, name, sets, reps, weight, rpe, notes }
  Returns: { id, ... exercise data }

PUT /api/exercises/:id
  Headers: Authorization: Bearer <token>
  Body: { date, name, sets, reps, weight, rpe, notes }
  Returns: Updated exercise

DELETE /api/exercises/:id
  Headers: Authorization: Bearer <token>
  Returns: { success: true }

GET /api/backup/export
  Headers: Authorization: Bearer <token>
  Returns: JSON file of all exercises
```

---

## Next Steps

1. **Explore the Code**
   - Frontend UI: `frontend/src/main.ts` (440+ lines, fully functional)
   - Backend API: `backend/src/routes.ts` (all endpoints)
   - Database: `backend/src/database.ts` (schema)

2. **Customize**
   - Edit `frontend/src/styles.css` for different look
   - Change colors, fonts, layout
   - Add new exercise fields

3. **Deploy** (future)
   - Build with `npm run build`
   - Deploy backend to cloud (Heroku, Railway, DigitalOcean)
   - Deploy frontend to static host (Vercel, Netlify)

4. **Add Features** (future)
   - AI form suggestions
   - Progress charts
   - Exercise library
   - Mobile app

---

## Support

- **Full Docs**: See README.md
- **Detailed Setup**: See SETUP.md
- **Features & Requirements**: See mvp-spec.md
- **Tool Setup**: See tool-setup.md

---

**You're all set! Start tracking your workouts! 💪**
